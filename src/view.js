import onChange from 'on-change';
import i18next from 'i18next';

const input = document.getElementById('url-input');
const feedback = document.getElementsByClassName('feedback')[0];
const i18n = i18next.createInstance();
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
};

const state = {
  errorCode: null,
  isInputValid: undefined,
};
function setTranslations(formElements, i18nElement) {
  formElements.header.innerText = i18nElement.t('rss_aggregator');
  formElements.headerDesc.innerText = i18nElement.t('start_reading');
  formElements.linkPlaceholder.innerText = i18nElement.t('link_placeholder');
  formElements.example.innerText = i18nElement.t('example_text');
  // elements.addBtn.innerText = i18n.t('add_button');
  // elements.posts.innerText = i18n.t('posts');
  // elements.feeds.innerText = i18n.t('feeds');
  // elements.readFull.innerText = i18n.t('read_full');
  // elements.closeModalBtn.innerText = i18n.t('close_button');
}

i18n.init(
  {
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          0: 'RSS успешно загружен',
          1: 'Ссылка должна быть валидным URL',
          2: 'RSS уже существует',
          3: 'Ресурс не содержит валидный RSS',
          4: 'Ошибка сети',
          rss_aggregator: 'RSS агрегатор',
          start_reading: 'Начните читать RSS сегодня! Это легко, это красиво.',
          link_placeholder: 'Ссылка RSS',
          example_text: 'Пример: https://lorem-rss.hexlet.app/feed',
          add_button: 'Добавить',
          posts: 'Посты',
          feeds: 'Ленты',
          read_full: 'Читать полностью',
          close_button: 'Закрыть',
        },
      },
    },
  },
  () => {
    // После инициализации i18next вызываем функцию для установки переводов
    setTranslations(elements, i18n);
  }
);

const render = () => {
  feedback.textContent = i18n.t(`${state.errorCode}`);
  feedback.classList.remove('text-danger');

  if (state.errorCode === 0) {
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
