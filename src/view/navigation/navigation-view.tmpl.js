import { FilmsFilterType } from '../../constants.js';
import { NavigationItemsType } from '../../constants.js';


const getFilters = (filters) => (
  filters.map((filter) => {
    switch (filter.type) {
      case FilmsFilterType.ALL:
        return { ...filter, href: '#all', title: 'All movies'};
      case FilmsFilterType.WATCHLIST:
        return { ...filter, href: '#watchlist', title: 'Watchlist'};
      case FilmsFilterType.HISTORY:
        return { ...filter, href: '#history', title: 'History'};
      case FilmsFilterType.FAVORITES:
        return { ...filter, href: '#favorites', title: 'Favorites'};
    }
  })
);


const getFilterElement = (filter) => {
  const countElement = filter.type !== FilmsFilterType.ALL ? ` <span class="main-navigation__item-count">${filter.count}</span>` : '';
  const activeClass = filter.active ? 'main-navigation__item--active' : '';

  return `<a href="${filter.href}" class="main-navigation__item ${activeClass}">${filter.title + countElement}</a>`;
};


const createFilters = (filters) => filters.map(
  (filter) => getFilterElement(filter)
).join('\n');


const createNavigationTemplate = (filters, navigationItemType) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${createFilters(getFilters(filters))}
    </div>
    <a href="#stats" class="main-navigation__additional ${navigationItemType === NavigationItemsType.STATISTICS ? 'main-navigation__additional--active' : ''}">Stats</a>
  </nav>`
);


export { createNavigationTemplate };
