import { createProfileTemplate } from './view/profile-view.js';
import { createNavigationTemplate } from './view/navigation-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmsTemplate } from './view/films-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
import { createShowMoreTemplate } from './view/show-more-view.js';
import { createStatisticsTemplate } from './view/statistics-view.js';
import { createFilmDetailsTemplate } from './view/film-details-view.js';


const FILMS_COUNT = 5;


const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const renderMainPage = () => {
  const header = document.querySelector('.header');
  renderTemplate(header, createProfileTemplate(), RenderPosition.BEFOREEND);

  const main = document.querySelector('.main');
  renderTemplate(main, createNavigationTemplate(), RenderPosition.BEFOREEND);
  renderTemplate(main, createSortTemplate(), RenderPosition.BEFOREEND);
  renderTemplate(main, createFilmsTemplate(), RenderPosition.BEFOREEND);

  const filmsList = main.querySelector('.films-list');

  const filmsListContainer = filmsList.querySelector('.films-list__container');
  for (let i = 0; i < FILMS_COUNT; ++i) {
    renderTemplate(filmsListContainer, createFilmCardTemplate(), RenderPosition.BEFOREEND);
  }

  renderTemplate(filmsList, createShowMoreTemplate(), RenderPosition.BEFOREEND);

  const footerStatistics = document.querySelector('.footer__statistics');
  renderTemplate(footerStatistics, createStatisticsTemplate(), RenderPosition.BEFOREEND);

  renderTemplate(document.body, createFilmDetailsTemplate(), RenderPosition.BEFOREEND);
};


export { renderMainPage };
