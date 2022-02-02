import { FilmSortType } from '../../constants.js';

const createSortTemplate = (filmSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${filmSortType === FilmSortType.BY_DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${FilmSortType.BY_DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${filmSortType === FilmSortType.BY_DATE ? 'sort__button--active' : ''}" data-sort-type="${FilmSortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${filmSortType === FilmSortType.BY_RATING ? 'sort__button--active' : ''}" data-sort-type="${FilmSortType.BY_RATING}">Sort by rating</a></li>
  </ul>`
);


export { createSortTemplate };
