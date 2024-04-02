import '../main.css';
import * as yup from 'yup';
import watchedState from './view.js';

const form = document.querySelector('form');
export const input = document.getElementById('url-input');
const postsSection = document.getElementsByClassName('posts')[0];
const feedsSection = document.getElementsByClassName('feeds')[0];

const feedHistory = [];
const schema = yup.string().url();

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const inputValue = input.value;
  schema.isValid(inputValue).then((valid) => {
    if (valid) {
      console.log('Я валидный');
      handleInput(inputValue);
    } else {
      handleInvalidInput();
    }
  });
});

const handleInput = (inputValue) => {
  if (feedHistory.includes(inputValue)) {
    watchedState.errorCode = 2;
    watchedState.isInputValid = false;
  } else {
    feedHistory.push(inputValue);

    fetch(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(inputValue)}`
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const rssLinks = doc.getElementsByTagName('rss');
        if (rssLinks.length === 0) {
          watchedState.errorCode = 3;
          watchedState.isInputValid = true;
        } else {
          watchedState.errorCode = 0;
          watchedState.isInputValid = true;
          input.value = '';
          input.focus();

          let postsList;
          let feedsList;

          if (
            postsSection.childNodes.length === 0 &&
            feedsSection.childNodes.length === 0
          ) {
            postsList = createContainer('Посты', postsSection);
            feedsList = createContainer('Фиды', feedsSection);
          } else {
            postsList = document.querySelectorAll(
              'ul.list-group.border-0.rounded-0'
            )[0];
            feedsList = document.querySelectorAll(
              'ul.list-group.border-0.rounded-0'
            )[1];
          }

          const feedTitle = doc.querySelector('title');
          const extractedFeed = extractCdataContent(feedTitle);

          const feedDesc = doc.querySelector('description');
          const extractedFeedDesc = extractCdataContent(feedDesc.childNodes[0]);

          const feedsItem = createFeeds(extractedFeed, extractedFeedDesc);
          feedsList.prepend(feedsItem);

          const items = doc.body.getElementsByTagName('item');
          let id = 1;
          for (let item of items) {
            const title = item.querySelector('title');
            const link = item.querySelector('guid').textContent;
            const extractedText = extractCdataContent(title);
            let listItem = createOnePost(id, link, extractedText);
            postsList.prepend(listItem);
            id++;
          }
        }
      });
  }
};

const handleInvalidInput = () => {
  watchedState.errorCode = 1;
  watchedState.isInputValid = false;
};

const extractCdataContent = (cdata) => {
  return cdata.textContent
    .replace('<![CDATA[', '')
    .replace(']]>', '')
    .replace(']]', '')
    .replace('[CDATA[', '');
};

const createContainer = (containerName, display) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  display.appendChild(container);

  const title = document.createElement('div');
  title.classList.add('card-body');
  title.innerHTML = `<h2 class="card-title h4">${containerName}</h2>`;
  container.appendChild(title);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  container.appendChild(list);

  return list;
};

const createOnePost = (id, url, textContent) => {
  const listItem = document.createElement('li');
  listItem.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0'
  );

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.href = url;
  link.setAttribute('data-id', id);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = textContent;

  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';

  listItem.appendChild(link);
  listItem.appendChild(button);

  return listItem;
};

const createFeeds = (firstText, secondText) => {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const descriptionTitle = document.createElement('h3');
  descriptionTitle.classList.add('h6', 'm-0');
  descriptionTitle.textContent = firstText;

  const descriptionText = document.createElement('p');
  descriptionText.classList.add('m-0', 'small', 'text-black-50');
  descriptionText.textContent = secondText;

  listItem.append(descriptionTitle, descriptionText);

  return listItem;
};
