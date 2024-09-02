import extractCdataContent from './extractCdataContent.js';

export default (modalElements, items, postTitle, buttonId) => {
  postTitle.classList.remove('fw-bold');
  postTitle.classList.add('fw-normal', 'link-secondary');
  modalElements.modalTitle.textContent = postTitle.textContent;
  modalElements.modalBody.textContent = extractCdataContent(
    items[buttonId].description
  );
};
