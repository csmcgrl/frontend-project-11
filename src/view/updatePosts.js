export default (link, length, postState) => {
  console.log(link, length, postState);
  const postItem = {};
  postItem.link = link;
  postItem.length = length;
  postState.push(postItem);
};
