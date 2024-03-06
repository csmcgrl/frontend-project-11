import onChange from 'on-change';
import i18next from 'i18next';
import { input } from './index.js';

const feedback = document.getElementsByClassName('feedback')[0];

const state = {
  errorCode: null,
  isInputValid: undefined,
};

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        0: 'RSS успешно загружен',
        1: 'Ссылка должна быть валидным URL',
        2: 'RSS уже существует',
      },
    },
  },
});

const render = () => {
  feedback.textContent = i18next.t(`${state.errorCode}`);
  feedback.classList.remove('text-danger');

  state.errorCode === 0
    ? feedback.classList.add('text-success')
    : feedback.classList.add('text-danger');

  input.classList.remove('is-invalid');
  if (!state.isInputValid) {
    input.classList.add('is-invalid');
  }
};

const watchedState = onChange(state, render);

export default watchedState;
