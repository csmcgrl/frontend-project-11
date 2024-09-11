import './main.css';
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import watchedState from './view/view.js';
import buildUrl from './utils/proxy.js';
import validateUrl from './utils/validation.js';
import parseData from './utils/parser.js';
import { initLocal } from './local.js';
import renderPosts from './view/renderPosts.js';
import updatePosts from './view/updatePosts.js';
import renderFeeds from './view/renderFeeds.js';
import renderModal from './view/renderModal.js';

export default () => {
  const elements = {
    header: document.querySelector('h1'),
    headerDesc: document.querySelector('p.lead'),
    linkPlaceholder: document.getElementsByTagName('label')[0],
    example: document.querySelector('p.mt-2.mb-0.text-muted'),
    addBtn: document.querySelector('button[type="submit"]'),
    posts: document.getElementsByTagName('h2')[0],
    feeds: document.getElementsByTagName('h2')[1],
    readFull: document.querySelector('button.btn-primary.full-article'),
    closeModalBtn: document.querySelector('button.btn-secondary'),
    input: document.getElementById('url-input'),
    form: document.querySelector('form'),
    postsSection: document.getElementsByClassName('posts')[0],
    feedsSection: document.getElementsByClassName('feeds')[0],
    //backdrops: document.querySelectorAll('div.modal-backdrop.fade.show'), //Добавила
    modalElements: {
      modal: document.getElementById('modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
    },
  };

  initLocal(elements);

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
        watchedState.errorCode = 'networkErr';
        watchedState.isInputValid = false;
        throw error;
      });
  }

  function attachEventListeners(items) {
    const modalButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
    modalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const buttonId = button.getAttribute('data-id');

        // const modalElements = {
        //   modal: document.getElementById('modal'),
        //   modalTitle: document.querySelector('.modal-title'),
        //   modalBody: document.querySelector('.modal-body'),
        // };
        const modalElements = elements.modalElements;

        const postTitle = document.querySelector(`[data-id="${buttonId}"]`);

        const myModal = new Modal(modalElements.modal);

        renderModal(modalElements, items, postTitle, buttonId);
        myModal.show();

        const backdrops = document.querySelectorAll('div.modal-backdrop.fade.show');
        //const backdrops = elements.backdrops; //добавила

        if (backdrops.length > 1) {
          backdrops[0].remove();
        }
        document.addEventListener('hidden.bs.modal', () => {
          document.body.style = '';
        });
      });
    });
  }

  function handleData(doc) {
    if (doc.items.length === 0) {
      watchedState.errorCode = 'invalidResourceErr';
      watchedState.isInputValid = false;
      feedHistory.pop();
      return null;
    }
    watchedState.errorCode = 'successLoad';
    watchedState.isInputValid = true;
    elements.input.value = '';
    elements.input.focus();

    const length = renderPosts(doc.items, elements);
    renderFeeds(doc.feedTitle, doc.feedDescription, elements);
    attachEventListeners(doc.items);
    return length;
  }

  function handleInput(inputValue) {
    feedHistory.push(inputValue);
    fetchData(inputValue)
      .then(parseData)
      .then(handleData)
      .then((length) => {
        updatePosts(inputValue, length, postState);
      })
      .catch((error) => {
        console.error('Parsing error:', error);
        console.log('ошибка тут');
        watchedState.errorCode = 'parseErr';
        watchedState.isInputValid = true;
        console.log(watchedState);
      });
  }

  function handleInvalidInput(inputValue) {
    if (feedHistory.includes(inputValue)) {
      watchedState.errorCode = 'existUrlErr';
      watchedState.isInputValid = false;
    } else {
      watchedState.errorCode = 'invalidUrlErr';
      watchedState.isInputValid = false;
    }
  }

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = elements.input.value;
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
