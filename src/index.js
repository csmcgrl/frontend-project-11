import '../main.css';
import * as yup from 'yup';
import watchedState from './view.js';
import i18next from 'i18next';

const schema = yup.string().url();
const form = document.querySelector('form');
export const input = document.getElementById('url-input');
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
