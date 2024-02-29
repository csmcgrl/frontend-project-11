import '../main.css';
import * as yup from 'yup';
import watchedState from './view.js';

const schema = yup.string().url();
const form = document.querySelector('form');
const input = document.getElementById('url-input');
const feedHistory = [];

// Обработка ввода
const handleInput = (inputValue) => {
  if (feedHistory.includes(inputValue)) {
    watchedState.feedbackMessage = 'RSS уже существует';
    watchedState.feedbackClassName = 'text-danger';
  } else {
    feedHistory.push(inputValue);
    watchedState.feedbackMessage = 'RSS успешно загружен';
    watchedState.feedbackClassName = 'text-success';
    watchedState.inputIsValid = true;
    input.value = '';
    input.focus();
  }
};

// Обработка невалидного ввода
const handleInvalidInput = () => {
  watchedState.feedbackMessage = 'Ссылка должна быть валидным URL';
  watchedState.feedbackClassName = 'text-danger';
  watchedState.inputIsValid = false;
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
