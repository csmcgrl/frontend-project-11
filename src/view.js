import onChange from 'on-change';
import { i18n } from './local.js';

const input = document.getElementById('url-input');
const feedback = document.getElementsByClassName('feedback')[0];

const state = {
  errorCode: null,
  isInputValid: undefined,
};

const render = () => {
  feedback.textContent = i18n.t(`${state.errorCode}`);
  feedback.classList.remove('text-danger');

  if (state.errorCode === 'successLoad') {
    feedback.classList.add('text-success');
  } else {
    feedback.classList.add('text-danger');
  }

  input.classList.remove('is-invalid');
  if (!state.isInputValid) {
    input.classList.add('is-invalid');
  }
};

const watchedState = onChange(state, render);

export default watchedState;
