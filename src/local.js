import i18next from 'i18next';

export const i18n = i18next.createInstance();

function setTranslations(formElements, i18nElement) {
  formElements.header.innerText = i18nElement.t('rss_aggregator');
  formElements.headerDesc.innerText = i18nElement.t('start_reading');
  formElements.linkPlaceholder.innerText = i18nElement.t('link_placeholder');
  formElements.example.innerText = i18nElement.t('example_text');
  // formElements.addBtn.innerText = i18nElement.t('add_button');
  // formElements.posts.innerText = i18nElement.t('posts');
  // formElements.feeds.innerText = i18nElement.t('feeds');
  // formElements.readFull.innerText = i18nElement.t('read_full');
  // formElements.closeModalBtn.innerText = i18nElement.t('close_button');
}
export const initLocal = (elements) => {
  i18n.init(
    {
      lng: 'ru',
      debug: true,
      resources: {
        ru: {
          translation: {
            successLoad: 'RSS успешно загружен',
            invalidUrlErr: 'Ссылка должна быть валидным URL',
            existUrlErr: 'RSS уже существует',
            invalidResourceErr: 'Ресурс не содержит валидный RSS',
            networkErr: 'Ошибка сети',
            rss_aggregator: 'RSS агрегатор',
            start_reading:
              'Начните читать RSS сегодня! Это легко, это красиво.',
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
};
