import i18next from 'i18next';

export const i18n = i18next.createInstance();

function setTranslations(formElements, i18nElement) {
  const elements = { ...formElements };
  elements.header.innerText = i18nElement.t('rss_aggregator');
  elements.headerDesc.innerText = i18nElement.t('start_reading');
  elements.linkPlaceholder.innerText = i18nElement.t('link_placeholder');
  elements.example.innerText = i18nElement.t('example_text');
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
            parseErr: 'Ошибка сети',
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
      setTranslations(elements, i18n);
    },
  );
};
