import { FilmsFilterType } from '../../constants.js';


const printStubText = (filterType) => {
  switch (filterType) {
    case FilmsFilterType.ALL:
      return 'There are no movies in our database';
    case FilmsFilterType.WATCHLIST:
      return 'There are no movies to watch now';
    case FilmsFilterType.HISTORY:
      return 'There are no watched movies now';
    case FilmsFilterType.FAVORITES:
      return 'There are no favorite movies now';
    default:
      return '';
  }
};


const createEmptyFilmsTemplate = (filmsFilterType) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${printStubText(filmsFilterType)}</h2>
    </section>
  </section>`
);


export { createEmptyFilmsTemplate };
