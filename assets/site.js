// Content and navigation remain usable without JavaScript.
const search = document.querySelector('.page-search');
const results = document.querySelector('.search-results');
const searchSections = [...document.querySelectorAll('main section[id], main article[id]')];
if (search && results) {
  search.addEventListener('submit', event => {
    event.preventDefault();
    const term = search.elements.q.value.trim();
    if (!term) return;
    const matches = searchSections.filter(section => section.textContent.toLowerCase().includes(term.toLowerCase()));
    const list = results.querySelector('ul');
    list.replaceChildren();
    matches.forEach(section => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + section.id;
      link.textContent = section.querySelector('h1, h2, h3').textContent;
      li.append(link);
      list.append(li);
    });
    results.querySelector('.search-status').textContent = matches.length
      ? '“' + term + '”出现在 ' + matches.length + ' 个栏目中：'
      : '本页未找到“' + term + '”。';
    results.hidden = false;
    results.scrollIntoView({block: 'start'});
  });
  results.querySelector('.close-search').addEventListener('click', () => {
    results.hidden = true;
    search.elements.q.focus();
  });
}
