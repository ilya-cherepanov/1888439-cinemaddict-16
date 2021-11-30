import { createProfileTemplate } from './view/profile-view.js';
import { createNavigationTemplate } from './view/navigation-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmsTemplate } from './view/films-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
import { createShowMoreTemplate } from './view/show-more-view.js';
import { createStatisticsTemplate } from './view/statistics-view.js';
import { createFilmDetailsTemplate } from './view/film-details-view.js';
import { createFilms, createComments, createFilters } from './mocking.js';


const FILMS_COUNT = 23;
const FILMS_PER_STEP = 5;
const FILMS = createFilms(FILMS_COUNT);


const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const renderFilms = (step = 0) => {
  const filmsListContainer = document.querySelector('.films-list__container');
  const initialIndex = FILMS_PER_STEP * step;

  let i = initialIndex;
  for (; i < Math.min((initialIndex + FILMS_PER_STEP), FILMS.length); ++i) {
    renderTemplate(filmsListContainer, createFilmCardTemplate(FILMS[i]), RenderPosition.BEFOREEND);
  }

  const filmListEnded = i >= FILMS.length;
  return filmListEnded;
};


const showMoreButtonHandler = (evt) => {
  evt.preventDefault();
  const { target } = evt;

  const filmListEnded = renderFilms(target.dataset.step);

  if (filmListEnded) {
    target.remove();
  } else {
    target.dataset.step++;
  }
};


const renderMainPage = () => {
  const header = document.querySelector('.header');
  renderTemplate(header, createProfileTemplate(FILMS), RenderPosition.BEFOREEND);

  const filters = createFilters(FILMS);
  const main = document.querySelector('.main');
  renderTemplate(main, createNavigationTemplate(filters), RenderPosition.BEFOREEND);
  renderTemplate(main, createSortTemplate(), RenderPosition.BEFOREEND);
  renderTemplate(main, createFilmsTemplate(), RenderPosition.BEFOREEND);

  const filmList = main.querySelector('.films-list');

  const filmListEnded = renderFilms();

  if (!filmListEnded) {
    renderTemplate(filmList, createShowMoreTemplate(), RenderPosition.BEFOREEND);
    const showMoreButton = filmList.querySelector('.films-list__show-more');
    showMoreButton.dataset.step = 1;
    showMoreButton.addEventListener('click', showMoreButtonHandler);
  }

  const footerStatistics = document.querySelector('.footer__statistics');
  renderTemplate(footerStatistics, createStatisticsTemplate(FILMS.length), RenderPosition.BEFOREEND);

  const comments = createComments(FILMS[0].comments);
  renderTemplate(document.body, createFilmDetailsTemplate(FILMS[0], comments), RenderPosition.BEFOREEND);
};


export { renderMainPage };
