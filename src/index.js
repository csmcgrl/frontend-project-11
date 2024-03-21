import '../main.css';
import * as yup from 'yup';
import watchedState from './view.js';
import i18next from 'i18next';

const schema = yup.string().url();
const form = document.querySelector('form');
export const input = document.getElementById('url-input');
const displayPosts = document.getElementsByClassName('posts')[0];
const feedHistory = [];

// yup.setLocale({
//   invalid: i18next.t('1'),
//   duplicate: i18next.t('2'),
// });

const handleInput = (inputValue) => {
  if (feedHistory.includes(inputValue)) {
    watchedState.errorCode = 2;
    watchedState.isInputValid = false;
  } else {
    feedHistory.push(inputValue);
    watchedState.errorCode = 0;
    watchedState.isInputValid = true;
    input.value = '';
    input.focus();

    fetch(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(inputValue)}`
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        const postsList = createPosts();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const items = doc.body.getElementsByTagName('item');
        let id = 1;
        for (let item of items) {
          const title = item.querySelector('title');
          const link = item.querySelector('guid').textContent;
          const extractedText = title.textContent
            .replace('<![CDATA[', '')
            .replace(']]>', '');
          let listItem = createOnePost(id, link, extractedText);
          postsList.appendChild(listItem);
          id++;
        }
      });
  }
};

const handleInvalidInput = () => {
  watchedState.errorCode = 1;
  watchedState.isInputValid = false;
};

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const inputValue = input.value;

  schema.isValid(inputValue).then((valid) => {
    if (valid) {
      handleInput(inputValue);
    } else {
      handleInvalidInput();
    }
  });
});

//Создаем на странице посты и фиды
const createPosts = () => {
  const postsContainer = document.createElement('div');
  postsContainer.classList.add('card', 'border-0');
  displayPosts.appendChild(postsContainer);

  const postsTitle = document.createElement('div');
  postsTitle.classList.add('card-body');
  postsTitle.innerHTML = '<h2 class="card-title h4">Посты</h2>';
  postsContainer.appendChild(postsTitle);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  postsContainer.appendChild(postsList);

  return postsList;
};

//функция для создания одного элемента списка постов
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
