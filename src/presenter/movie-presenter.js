import { render, RenderPosition, replace } from '../utils/render.js';
import { createFilters, createComments } from '../mocking.js';
import { FilmsFilterType, Films } from '../constants.js';
import { isListEnded } from '../utils/checking.js';
import { isEscKey } from '../utils/checking.js';
import EmptyFilmsView from '../view/empty-films/empty-films-view.js';
import FilmsView from '../view/films/films-view.js';
import ProfileView from '../view/profile/profile-view.js';
import NavigationView from '../view/navigation/navigation-view.js';
import StatisticsView from '../view/statistics/statistics-view.js';
import ShowMoreView from '../view/show-more/show-more-view.js';
import SortView from '../view/sort/sort-view.js';
import FilmCardView from '../view/film-card/film-card-view.js';
import FilmDetailsView from '../view/film-details/film-details-view.js';


export default class MoviePresenter {
  #films = null;
  #filters = null;
  #currentStep = 0;

  #showMoreView = new ShowMoreView();
  #sortView = new SortView();
  #profileView = null;
  #navigationView = null;
  #filmsView = null;
  #statisticsView = null;
  #filmDetailsView = null;
  #filmCardsViews = new Map();

  #headerElement = document.querySelector('.header');
  #mainElement = document.querySelector('.main');

  constructor(films) {
    this.#films = [...films];
    this.#filters = createFilters(films);
  }

  showAll = () => {
    this.#showProfile();
    this.#showNavigation();
    this.#showFilms();
    this.#showStatistics();
  }

  #showProfile = () => {
    this.#profileView = new ProfileView(this.#films);
    render(this.#headerElement, this.#profileView, RenderPosition.BEFOREEND);
  }

  #updateProfile = () => {
    const oldProfileView = this.#profileView;
    this.#profileView = new ProfileView(this.#films);
    replace(oldProfileView, this.#profileView);
  }

  #showNavigation = () => {
    this.#navigationView = new NavigationView(this.#filters);
    render(this.#mainElement, this.#navigationView, RenderPosition.BEFOREEND);
  }

  #updateNavigation = () => {
    const oldNavigationView = this.#navigationView;
    this.#filters = createFilters(this.#films);
    this.#navigationView = new NavigationView(this.#filters);
    replace(oldNavigationView, this.#navigationView);
  }

  #showFilmsContainer = () => {
    this.#filmsView = this.#films.length > 0 ? new FilmsView() : new EmptyFilmsView(FilmsFilterType.ALL);
    render(this.#mainElement, this.#filmsView, RenderPosition.BEFOREEND);

    if (this.#filmsView instanceof FilmsView) {
      const mainNavigation = document.querySelector('.main-navigation');
      render(mainNavigation, this.#sortView, RenderPosition.AFTEREND);
    }
  }


  #showFilms = () => {
    this.#showFilmsContainer();

    if (this.#filmsView instanceof EmptyFilmsView) {
      return;
    }

    this.#showFilmsList();
  }

  #showFilmsList = () => {
    this.#showFilmsPortion();

    if (isListEnded(this.#films, this.#currentStep, Films.COUNT_PER_STEP)) {
      return;
    }

    this.#showMoreButton();
  }

  #showMoreButton = () => {
    this.#showMoreView.setClickHandler(this.#showMoreButtonHandler);

    const filmListElement = document.querySelector('.films-list');
    render(filmListElement, this.#showMoreView, RenderPosition.BEFOREEND);
  }

  #showFilmCard = (container, film) => {
    const filmCardView = new FilmCardView(film);
    filmCardView.setClickOpenDetails(this.#showFilmDetails);
    filmCardView.setClickControlsHandler(this.#handleCardControlClick);
    this.#filmCardsViews.set(film.id, filmCardView);
    render(container, filmCardView, RenderPosition.BEFOREEND);
  }

  #showStatistics = () => {
    this.#statisticsView = new StatisticsView(this.#films.length);
    const footerStatisticsElement = document.querySelector('.footer__statistics');
    render(footerStatisticsElement, this.#statisticsView, RenderPosition.BEFOREEND);
  }

  #showMoreButtonHandler = () => {
    this.#showFilmsPortion();

    if (isListEnded(this.#films, this.#currentStep, Films.COUNT_PER_STEP)) {
      this.#showMoreView.removeElement();
    }
  }

  #showFilmsPortion = () => {
    const filmsListContainer = document.querySelector('.films-list__container');

    const initialIndex = Films.COUNT_PER_STEP * this.#currentStep;
    for (let i = initialIndex; i < Math.min((initialIndex + Films.COUNT_PER_STEP), this.#films.length); ++i) {
      this.#showFilmCard(filmsListContainer, this.#films[i]);
    }

    this.#currentStep += 1;
  }

  #showFilmDetails = (film) => {
    this.#closeFilmDetails();

    const comments = createComments(film.comments);
    this.#filmDetailsView = new FilmDetailsView(film, comments);
    this.#filmDetailsView.setClickCloseHandler(this.#closeFilmDetails);
    this.#filmDetailsView.setClickControlsHandler(this.#handleDetailsControlClick);

    document.body.classList.add('hide-overflow');
    render(document.body, this.#filmDetailsView, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this.#pressEscHandler);
  }

  #closeFilmDetails = () => {
    if (this.#filmDetailsView === null) {
      return;
    }

    this.#filmDetailsView.removeElement();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#pressEscHandler);

    this.#filmDetailsView = null;
  }

  #pressEscHandler = (evt) => {
    if (isEscKey(evt)) {
      this.#closeFilmDetails();
    }
  }

  #handleDetailsControlClick = (filmUpdate, comments) => {
    const oldFilmDetailsView = this.#filmDetailsView;

    this.#filmDetailsView = new FilmDetailsView(filmUpdate, comments);
    this.#filmDetailsView.setClickCloseHandler(this.#closeFilmDetails);
    this.#filmDetailsView.setClickControlsHandler(this.#handleDetailsControlClick);

    replace(oldFilmDetailsView, this.#filmDetailsView);

    this.#handleCardControlClick(filmUpdate);
  }

  #handleCardControlClick = (filmUpdate) => {
    this.#updateFilms(filmUpdate);

    const oldFilmCardView = this.#filmCardsViews.get(filmUpdate.id);

    const updatedFilmCardView = new FilmCardView(filmUpdate);
    updatedFilmCardView.setClickControlsHandler(this.#handleCardControlClick);
    updatedFilmCardView.setClickOpenDetails(this.#showFilmDetails);
    this.#filmCardsViews.set(filmUpdate.id, updatedFilmCardView);

    replace(oldFilmCardView, updatedFilmCardView);

    this.#updateProfile();
    this.#updateNavigation();
  }

  //Потом пригодится
  // #clearFilmsList = () => {
  //   this.#filmCardsViews.forEach((filmCardView) => filmCardView.removeElement());
  //   this.#filmCardsViews.clear();
  //   this.#currentStep = 0;
  //   this.#showMoreView.removeElement();
  // }

  #updateFilms = (filmUpdate) => {
    const index = this.#films.findIndex((item) => item.id === filmUpdate.id);

    if (index === -1) {
      return;
    }

    this.#films = [
      ...this.#films.slice(0, index),
      filmUpdate,
      ...this.#films.slice(index + 1),
    ];
  }
}
