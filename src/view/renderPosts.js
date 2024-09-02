import extractCdataContent from './extractCdataContent.js';
import makeList from './makeList.js';

function createOnePost(id, url, textContent) {
  const listItem = document.createElement('li');
  listItem.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0'
  );
  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.href = url;
  link.setAttribute('data-id', id);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = textContent;
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';
  listItem.appendChild(link);
  listItem.appendChild(button);
  return listItem;
}

function renderPosts(items, elements) {
  const postsList = makeList(elements.postsSection, 'Посты');

  let id = 0;
  items.forEach((item) => {
    const extractedText = extractCdataContent(item.title);
    const listItem = createOnePost(id, item.link, extractedText);
    postsList.prepend(listItem);
    id += 1;
  });
  return items.length;
}

export default renderPosts;
