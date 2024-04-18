import '../main.css';
import * as yup from 'yup';
import watchedState from './view.js';

const form = document.querySelector('form');
export const input = document.getElementById('url-input');
const postsSection = document.getElementsByClassName('posts')[0];
const feedsSection = document.getElementsByClassName('feeds')[0];

const feedHistory = [];
const postState = [];
const schema = yup.string().url();

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const inputValue = input.value;
  schema.isValid(inputValue).then((valid) => {
    if (valid) {
      handleInput(inputValue);
    } else {
      handleInvalidInput(1);
    }
  });
});

const handleInput = (inputValue) => {
  if (feedHistory.includes(inputValue)) {
    watchedState.errorCode = 2;
    watchedState.isInputValid = false;
  } else {
    feedHistory.push(inputValue);
    fetchData(inputValue)
      .then(parseData)
      .then(handleData)
      .then((length) => {
        updatePosts(inputValue, length);
      });
  }
};
const updatePosts = (link, length) => {
  const postItem = {};
  postItem.link = link;
  postItem.length = length;
  postState.push(postItem);
};

setTimeout(function repeat() {
  console.log('я родился');
  postState.map((item) => {
    fetchData(item.link)
      .then(parseData)
      .then((doc) => {
        console.log(
          'старая длина ',
          item.length,
          ' новая длина ',
          doc.items.length
        );
      });
  });
  setTimeout(repeat, 5000);
}, 0);

const fetchData = (inputValue) => {
  return fetch(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(inputValue)}`
  ).then((response) => {
    if (response.ok) return response.json();
    throw new Error('Network response was not ok.');
  });
};

const parseData = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.contents, 'text/html');

  return {
    rssLinks:
      doc.getElementsByTagName('rss').length > 0
        ? doc.getElementsByTagName('rss')
        : null,
    feedTitle: doc.querySelector('title')
      ? doc.querySelector('title').textContent
      : null,
    feedDescription: doc.querySelector('description')
      ? doc.querySelector('description').childNodes[0].textContent
      : null,
    items: Array.from(doc.body.getElementsByTagName('item')).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('guid').textContent,
    })),
  };
};

const renderPosts = (items) => {
  let postsList;
  if (postsSection.childNodes.length === 0) {
    postsList = createContainer('Посты', postsSection);
  } else {
    postsList = document.querySelectorAll(
      'ul.list-group.border-0.rounded-0'
    )[0];
  }
  let id = 1;
  items.map((item) => {
    const extractedText = extractCdataContent(item.title);
    let listItem = createOnePost(id, item.link, extractedText);
    postsList.prepend(listItem);
    id++;
  });
  return items.length;
};
const renderFeeds = (feedTitle, feedDescription) => {
  let feedsList;
  if (feedsSection.childNodes.length === 0) {
    feedsList = createContainer('Фиды', feedsSection);
  } else {
    feedsList = document.querySelectorAll(
      'ul.list-group.border-0.rounded-0'
    )[1];
  }
  const extractedFeed = extractCdataContent(feedTitle);
  const extractedFeedDesc = extractCdataContent(feedDescription);
  const feedsItem = createFeeds(extractedFeed, extractedFeedDesc);
  feedsList.prepend(feedsItem);
};

const handleData = (doc) => {
  if (doc.items.length === 0) {
    handleInvalidInput(3);
    feedHistory.pop();
  } else {
    watchedState.errorCode = 0;
    watchedState.isInputValid = true;
    input.value = '';
    input.focus();

    const length = renderPosts(doc.items);
    renderFeeds(doc.feedTitle, doc.feedDescription);
    return length;
  }
};

const extractCdataContent = (cdata) => {
  return cdata
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

const handleInvalidInput = (code) => {
  console.log(code);
  watchedState.errorCode = code;
  watchedState.isInputValid = false;
};
