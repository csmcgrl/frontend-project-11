export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.contents, 'text/html');
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    const error = parseError.textContent;
    throw new Error(error);
  }

  return {
    rssLinks: doc.getElementsByTagName('rss').length > 0 ? doc.getElementsByTagName('rss') : null,
    feedTitle: doc.querySelector('title') ? doc.querySelector('title').textContent : null,
    feedDescription: doc.querySelector('description') ? doc.querySelector('description').childNodes[0].textContent : null,
    items: Array.from(doc.body.getElementsByTagName('item')).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('guid').textContent,
      description: item.querySelector('description').childNodes[0].textContent,
    })),
  };
};
