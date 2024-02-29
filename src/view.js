import onChange from 'on-change';

// Получение элементов из DOM
const input = document.getElementById('url-input');
const feedback = document.getElementsByClassName('feedback')[0];

// Определение объекта состояния
const state = {
  feedbackMessage: '',
  feedbackClassName: '',
  inputIsValid: false,
};

// Функция рендеринга, обновляющая пользовательский интерфейс
const render = () => {
  feedback.textContent = state.feedbackMessage;
  feedback.classList.remove('text-danger');
  state.feedbackClassName
    ? feedback.classList.add(state.feedbackClassName)
    : null;

  //feedback.className = `${state.feedbackClassName}`;
  input.classList.remove('is-invalid');
  if (!state.inputIsValid) {
    input.classList.add('is-invalid');
  }
};

// Создание прослушивателя изменений состояния
const watchedState = onChange(state, render);

// Экспорт объекта watchedState
export default watchedState;
