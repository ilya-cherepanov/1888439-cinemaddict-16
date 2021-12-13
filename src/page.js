import ProfileView from './view/profile/profile-view.js';
import NavigationView from './view/navigation/navigation-view.js';
import SortView from './view/sort/sort-view.js';
import FilmsView from './view/films/films-view.js';
import FilmCardView from './view/film-card/film-card-view.js';
import ShowMoreView from './view/show-more/show-more-view.js';
import StaticticsView from './view/statistics/statistics-view.js';
import EmptyFilmsView from './view/empty-films/empty-films-view.js';
import FilmsListExtraView from './view/films-list-extra/films-list-extra.js';
import { createFilms, createFilters } from './mocking.js';
import { RenderPosition, render } from './utils/render.js';
import { FilmsFilterType, FilmsListExtraType, Films } from './constants.js';
import { sortFilms, getComparer } from './utils/sorting.js';


const FILMS = createFilms(Films.COUNT);


const displayFilms = (step = 0) => {
  const filmsListContainer = document.querySelector('.films-list__container');
  const initialIndex = Films.COUNT_PER_STEP * step;

  let i = initialIndex;
  for (; i < Math.min((initialIndex + Films.COUNT_PER_STEP), FILMS.length); ++i) {
    const filmCradView = new FilmCardView(FILMS[i]);
    render(filmsListContainer, filmCradView, RenderPosition.BEFOREEND);
  }

  const isFilmListEnded = i >= FILMS.length;
  return isFilmListEnded;
};


const displayFilmsListExtra = (containerElement, filmsListExtraType) => {
  const filmsListExtraView = new FilmsListExtraView(filmsListExtraType);
  render(containerElement, filmsListExtraView, RenderPosition.BEFOREEND);

  const sortedFilms = sortFilms(FILMS, getComparer(filmsListExtraType));

  const filmsListContainer = filmsListExtraView.element.querySelector('.films-list__container');
  for (const film of sortedFilms) {
    const filmCradView = new FilmCardView(film);
    render(filmsListContainer, filmCradView, RenderPosition.BEFOREEND);
  }
};


const displayFilmsList = () => {
  const mainNavigation = document.querySelector('.main-navigation');
  const sortView = new SortView();
  render(mainNavigation, sortView, RenderPosition.AFTEREND);

  const filmListElement = document.querySelector('.films-list');

  const isFilmListEnded = displayFilms();

  if (!isFilmListEnded) {
    const showMoreView = new ShowMoreView();
    render(filmListElement, showMoreView, RenderPosition.BEFOREEND);

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

  const filmsElement = filmListElement.parentElement;
  displayFilmsListExtra(filmsElement, FilmsListExtraType.TOP_RATED);
  displayFilmsListExtra(filmsElement, FilmsListExtraType.MOST_COMMENTED);
};


const displayMainPage = () => {
  const headerElement = document.querySelector('.header');
  const profileView = new ProfileView(FILMS);
  render(headerElement, profileView, RenderPosition.BEFOREEND);

  const mainElement = document.querySelector('.main');

  const filters = createFilters(FILMS);
  const navigationView = new NavigationView(filters);
  render(mainElement, navigationView, RenderPosition.BEFOREEND);

  const filmsView = FILMS.length > 0 ? new FilmsView() : new EmptyFilmsView(FilmsFilterType.ALL);
  render(mainElement, filmsView, RenderPosition.BEFOREEND);
  if (filmsView instanceof FilmsView) {
    displayFilmsList();
  }

  const footerStatisticsElement = document.querySelector('.footer__statistics');
  const statisticsView = new StaticticsView(FILMS.length);
  render(footerStatisticsElement, statisticsView, RenderPosition.BEFOREEND);
};


export { displayMainPage };
