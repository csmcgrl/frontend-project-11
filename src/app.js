import './main.css';
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import watchedState from './view.js';
import buildUrl from './utils/proxy.js';
import validateUrl from './utils/validation.js';
import parseData from './utils/parser.js';

export default () => {
  const input = document.getElementById('url-input');
  const form = document.querySelector('form');

  const postsSection = document.getElementsByClassName('posts')[0];
  const feedsSection = document.getElementsByClassName('feeds')[0];

  const feedHistory = [];
  const postState = [];

  function fetchData(inputValue) {
    const url = buildUrl(inputValue);
    return fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .catch((error) => {
        watchedState.errorCode = 4;
        watchedState.isInputValid = false;
        throw error;
      });
  }

  function handleData(doc) {
    if (doc.items.length === 0) {
      watchedState.errorCode = 3;
      watchedState.isInputValid = false;
      feedHistory.pop();
    } else {
      watchedState.errorCode = 0;
      watchedState.isInputValid = true;
      input.value = '';
      input.focus();

      const length = renderPosts(doc.items);
      renderFeeds(doc.feedTitle, doc.feedDescription);
      attachEventListeners(doc.items);
      return length;
    }
  }

  function updatePosts(link, length) {
    const postItem = {};
    postItem.link = link;
    postItem.length = length;
    postState.push(postItem);
  }

  function makeList(section, name) {
    if (section.childNodes.length === 0) {
      return createContainer(`${name}`, section);
    }
    const lists = document.querySelectorAll('ul.list-group.border-0.rounded-0');
    return (
      Array.from(lists).find((list) => {
        const title = list.parentElement.querySelector('.card-title');
        return title && title.textContent.includes(name);
      }) || createContainer(`${name}`, section)
    );
  }

  function extractCdataContent(cdata) {
    return cdata
      .replace('<![CDATA[', '')
      .replace(']]>', '')
      .replace(']]', '')
      .replace('[CDATA[', '');
  }

  function createOnePost(id, url, textContent) {
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
  }

  function createFeeds(firstText, secondText) {
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
  }

  function createContainer(containerName, display) {
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
  }

  function attachEventListeners(items) {
    const modalButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
    modalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const buttonId = button.getAttribute('data-id');

        const postTitle = document.querySelector(`[data-id="${buttonId}"]`);

        postTitle.classList.remove('fw-bold');
        postTitle.classList.add('fw-normal', 'link-secondary');
        const myModal = new Modal(document.getElementById('modal'));

        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');

        modalTitle.textContent = postTitle.textContent;
        modalBody.textContent = extractCdataContent(
          items[buttonId].description
        );

        myModal.show();

        const backdrops = document.querySelectorAll(
          'div.modal-backdrop.fade.show'
        );

        if (backdrops.length > 1) {
          backdrops[0].remove();
        }
        document.addEventListener('hidden.bs.modal', () => {
          document.body.style = '';
        });
      });
    });
  }

  function renderPosts(items) {
    const postsList = makeList(postsSection, 'Посты');

    let id = 0;
    items.forEach((item) => {
      const extractedText = extractCdataContent(item.title);
      const listItem = createOnePost(id, item.link, extractedText);
      postsList.prepend(listItem);
      id += 1;
    });
    return items.length;
  }

  function renderFeeds(feedTitle, feedDescription) {
    const feedsList = makeList(feedsSection, 'Фиды');

    const extractedFeed = extractCdataContent(feedTitle);
    const extractedFeedDesc = extractCdataContent(feedDescription);
    const feedsItem = createFeeds(extractedFeed, extractedFeedDesc);
    feedsList.prepend(feedsItem);
  }

  function handleInput(inputValue) {
    feedHistory.push(inputValue);
    fetchData(inputValue)
      .then(parseData)
      .then(handleData)
      .then((length) => {
        updatePosts(inputValue, length);
      });
  }

  function handleInvalidInput(inputValue) {
    if (feedHistory.includes(inputValue)) {
      watchedState.errorCode = 2;
      watchedState.isInputValid = false;
    } else {
      watchedState.errorCode = 1;
      watchedState.isInputValid = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = input.value;
    validateUrl(feedHistory, inputValue)
      .then((result) => {
        if (result instanceof yup.ValidationError) {
          handleInvalidInput(inputValue);
        } else {
          handleInput(inputValue);
        }
      })
      .catch((err) => {
        console.error('Unhandled validation error:', err);
      });
  });
};
