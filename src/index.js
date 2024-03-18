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
        //console.log(data.contents, typeof data.contents)); //нужно распарсить data.contents
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        displayPosts.innerHTML = doc.body.innerHTML;
        //console.log(doc.body);
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
