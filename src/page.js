import ProfileView from './view/profile/profile-view.js';
import NavigationView from './view/navigation/navigation-view.js';
import SortView from './view/sort/sort-view.js';
import FilmsView from './view/films/films-view.js';
import FilmCardView from './view/film-card/film-card-view.js';
import ShowMoreView from './view/show-more/show-more-view.js';
import StaticticsView from './view/statistics/statistics-view.js';
import EmptyFilmsView from './view/empty-films/empty-films-view.js';
import { createFilms, createFilters } from './mocking.js';
import { RenderPosition, render } from './utils/render.js';
import { FilmsFilterType } from './constants.js';


const FILMS_COUNT = 23;
const FILMS_PER_STEP = 5;
const FILMS = createFilms(FILMS_COUNT);


const displayFilms = (step = 0) => {
  const filmsListContainer = document.querySelector('.films-list__container');
  const initialIndex = FILMS_PER_STEP * step;

  let i = initialIndex;
  for (; i < Math.min((initialIndex + FILMS_PER_STEP), FILMS.length); ++i) {
    const filmCradView = new FilmCardView(FILMS[i]);
    render(filmsListContainer, filmCradView.element, RenderPosition.BEFOREEND);
  }

  const isFilmListEnded = i >= FILMS.length;
  return isFilmListEnded;
};


const displayFilmsList = () => {
  const mainNavigation = document.querySelector('.main-navigation');
  const sortView = new SortView();
  render(mainNavigation, sortView.element, RenderPosition.AFTEREND);

  const filmListElement = document.querySelector('.films-list');

  const isFilmListEnded = displayFilms();

  if (!isFilmListEnded) {
    const showMoreView = new ShowMoreView();
    render(filmListElement, showMoreView.element, RenderPosition.BEFOREEND);

    let step = 1;
    showMoreView.setClickHandler(() => {
      const filmListEnded = displayFilms(step);

      if (filmListEnded) {
        showMoreView.removeElement();
      } else {
        step += 1;
      }
    });
  }
};


const displayMainPage = () => {
  const headerElement = document.querySelector('.header');
  const profileView = new ProfileView(FILMS);
  render(headerElement, profileView.element, RenderPosition.BEFOREEND);

  const mainElement = document.querySelector('.main');

  const filters = createFilters(FILMS);
  const navigationView = new NavigationView(filters);
  render(mainElement, navigationView.element, RenderPosition.BEFOREEND);

  const filmsView = FILMS.length > 0 ? new FilmsView() : new EmptyFilmsView(FilmsFilterType.ALL);
  render(mainElement, filmsView.element, RenderPosition.BEFOREEND);
  if (filmsView instanceof FilmsView) {
    displayFilmsList();
  }

  const footerStatisticsElement = document.querySelector('.footer__statistics');
  const statisticsView = new StaticticsView(FILMS.length);
  render(footerStatisticsElement, statisticsView.element, RenderPosition.BEFOREEND);
};


export { displayMainPage };
