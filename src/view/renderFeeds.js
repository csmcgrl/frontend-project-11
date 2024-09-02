import extractCdataContent from './extractCdataContent.js';
import makeList from './makeList.js';

function createFeeds(firstText, secondText) {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const descriptionTitle = document.createElement('h3');
  descriptionTitle.classList.add('h6', 'm-0');
  descriptionTitle.textContent = firstText;

  const descriptionText = document.createElement('p');
  descriptionText.classList.add('m-0', 'small', 'text-black-50');
  descriptionText.textContent = secondText;

  listItem.append(descriptionTitle, descriptionText);

  return listItem;
}

function renderFeeds(feedTitle, feedDescription, elements) {
  const feedsList = makeList(elements.feedsSection, 'Фиды');

  const extractedFeed = extractCdataContent(feedTitle);
  const extractedFeedDesc = extractCdataContent(feedDescription);
  const feedsItem = createFeeds(extractedFeed, extractedFeedDesc);
  feedsList.prepend(feedsItem);
}

export default renderFeeds;
