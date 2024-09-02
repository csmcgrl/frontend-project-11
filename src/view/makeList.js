function createContainer(containerName, display) {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  display.appendChild(container);

  const title = document.createElement('div');
  title.classList.add('card-body');
  title.innerHTML = `<h2 class="card-title h4">${containerName}</h2>`;
  container.appendChild(title);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  container.appendChild(list);

  return list;
}

function makeList(section, name) {
  if (section.childNodes.length === 0) {
    return createContainer(`${name}`, section);
  }
  const lists = document.querySelectorAll('ul.list-group.border-0.rounded-0');
  return (
    Array.from(lists).find((list) => {
      const title = list.parentElement.querySelector('.card-title');
      return title && title.textContent.includes(name);
    }) || createContainer(`${name}`, section)
  );
}

export default makeList;
