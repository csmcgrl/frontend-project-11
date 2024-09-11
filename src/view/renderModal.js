import extractCdataContent from './extractCdataContent.js';

export default (modalElements, items, postTitle, buttonId) => {
  const updatedModalElements = { ...modalElements };

  postTitle.classList.remove('fw-bold');
  postTitle.classList.add('fw-normal', 'link-secondary');

  updatedModalElements.modalTitle.textContent = postTitle.textContent;
  updatedModalElements.modalBody.textContent = extractCdataContent(items[buttonId].description);
};
