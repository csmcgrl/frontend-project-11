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
      description: item.querySelector('description').childNodes[0].textContent
    }))
  };
};
// export default (data) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(data.contents, 'text/html');
//   const parserError = doc.querySelector('parsererror');

//   if (parserError) {
//     throw new Error(parserError.textContent);
//   }

//   const rssLinks =
//     doc.getElementsByTagName('rss').length > 0
//       ? doc.getElementsByTagName('rss')
//       : null;
//   const feedTitle = doc.querySelector('title')?.textContent ?? null;
//   const feedDescription = doc.querySelector('description')?.textContent ?? null;

//   const items = Array.from(doc.querySelectorAll('item')).map((item) => {
//     const title = item.querySelector('title')?.textContent ?? '';
//     const link = item.querySelector('guid')?.textContent ?? '';
//     const description = item.querySelector('description')?.textContent ?? '';

//     return { title, link, description };
//   });

//   return {
//     rssLinks,
//     feedTitle,
//     feedDescription,
//     items,
//   };
// };
