import { FilmsListExtraType } from '../../constants.js';


const printFilmsListTitle = (filmsListExtraType) => {
  switch (filmsListExtraType) {
    case FilmsListExtraType.TOP_RATED:
      return 'Top rated';
    case FilmsListExtraType.MOST_COMMENTED:
      return 'Most commented';
    default:
      return '';
  }
};


const createFilmsListExtraTemplate = (filmsListExtraType) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${printFilmsListTitle(filmsListExtraType)}</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export { createFilmsListExtraTemplate };
