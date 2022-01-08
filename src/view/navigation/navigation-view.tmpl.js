import { FilmsFilterType } from '../../constants.js';

const NavigationItemsType = {
  ...FilmsFilterType,
  STATS: 'stats',
};

const getFilters = (filters) => (
  filters.map((filter) => {
    switch (filter.type) {
      case FilmsFilterType.ALL:
        return { ...filter, href: '#all'};
    }
  }
));

const getFilterElement = (filter) => (
  `<a href="${filter.href}" class="main-navigation__item main-navigation__item--active">${filter.title}</a>`
);


const createNavigationTemplate = (filters) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filters.watchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filters.history}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filters.favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

const createNavigationTemplate2 = (navigation) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filters.watchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filters.history}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filters.favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);


export { createNavigationTemplate };
