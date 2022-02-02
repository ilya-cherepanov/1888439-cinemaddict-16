import { render, RenderPosition, replace } from '../utils/render.js';
import { FILMS_COUNT_PER_STEP, UserAction, UpdateType, FilmSortType, FilmsFilterType } from '../constants.js';
import { isEscKey, isCtrlEnter } from '../utils/checking.js';
import { Filters } from '../utils/filters.js';
import { compareByDate, compareByRating } from '../utils/sorting.js';
import EmptyFilmsView from '../view/empty-films/empty-films-view.js';
import FilmsView from '../view/films/films-view.js';
import ProfileView from '../view/profile/profile-view.js';
import FilmCounterView from '../view/film-counter/film-counter-view.js';
import ShowMoreView from '../view/show-more/show-more-view.js';
import SortView from '../view/sort/sort-view.js';
import FilmCardView from '../view/film-card/film-card-view.js';
import FilmDetailsView from '../view/film-details/film-details-view.js';
import LoadingFilmsView from '../view/loading-films/loading-films-view.js';


export default class FilmPresenter {
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #showedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmSortType = FilmSortType.BY_DEFAULT;
  #isLoading = true;

  #showMoreView = new ShowMoreView();
  #sortView = null;
  #profileView = null;
  #filmsView = null;
  #filmCounterView = null;
  #filmDetailsView = null;
  #loadingFilmsView = new LoadingFilmsView();
  #filmCardsViews = new Map();

  #headerElement = document.querySelector('.header');
  #mainElement = document.querySelector('.main');

  constructor(filmsModel, commentsModel, filterModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.init();
  }

  get films() {
    const filteredFilms = Filters[this.#filterModel.filter](this.#filmsModel.films);

    switch (this.#filmSortType) {
      case FilmSortType.BY_DATE:
        return filteredFilms.sort(compareByDate);
      case FilmSortType.BY_RATING:
        return filteredFilms.sort(compareByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#showContent();
    this.#filmsModel.add(this.#handleModelNotification);
    this.#filterModel.add(this.#handleModelNotification);
    this.#commentsModel.add(this.#handleModelNotification);
  }

  destroy = () => {
    this.#clearFilmsList();

    this.#filmsModel.remove(this.#handleModelNotification);
    this.#filterModel.remove(this.#handleModelNotification);
    this.#commentsModel.remove(this.#handleModelNotification);
  }

  #showLoadingFilms = () => {
    render(this.#mainElement, this.#loadingFilmsView, RenderPosition.BEFOREEND);
  }

  #showProfile = () => {
    if (this.#profileView === null) {
      this.#profileView = new ProfileView(this.#filmsModel.films);
      render(this.#headerElement, this.#profileView, RenderPosition.BEFOREEND);
    }

    const oldProfileView = this.#profileView;
    this.#profileView = new ProfileView(this.#filmsModel.films);
    replace(oldProfileView, this.#profileView);
  }

  #showFilmsContainer = () => {
    this.#filmsView = this.films.length > 0 ? new FilmsView() : new EmptyFilmsView(this.#filterModel.filter);
    render(this.#mainElement, this.#filmsView, RenderPosition.BEFOREEND);

    if (this.#filmsView instanceof FilmsView) {
      this.#sortView = new SortView(this.#filmSortType);
      this.#sortView.setSortingChangeHandler(this.#handleSortingChange);
      render(this.#filmsView, this.#sortView, RenderPosition.BEFOREBEGIN);
    }
  }

  #showContent = () => {
    if (this.#isLoading) {
      this.#showLoadingFilms();
      return;
    }

    this.#showProfile();
    this.#showFilms();
    this.#showFilmCounter();
  }

  #showFilms = () => {
    this.#showFilmsContainer();

    if (this.#filmsView instanceof EmptyFilmsView) {
      return;
    }

    this.#showFilmsList();
  }

  #showFilmsList = () => {

    const films = this.films;
    const filmsCount = films.length;

    this.#showFilmsPortion(films.slice(0, Math.min(filmsCount, this.#showedFilmsCount)));

    if (filmsCount > this.#showedFilmsCount) {
      this.#showMoreButton();
    }
  }

  #showMoreButton = () => {
    this.#showMoreView.setClickHandler(this.#handleLoadMoreButtonClick);

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

  #showFilmCounter = () => {
    if (this.#filmCounterView === null) {
      this.#filmCounterView = new FilmCounterView(this.#filmsModel.films.length);
      const footerStatisticsElement = document.querySelector('.footer__statistics');
      render(footerStatisticsElement, this.#filmCounterView, RenderPosition.BEFOREEND);
    }

    const oldFilmCounterView = this.#filmCounterView;
    this.#filmCounterView = new FilmCounterView(this.#filmsModel.films.length);
    replace(oldFilmCounterView, this.#filmCounterView);
  }

  #showFilmsPortion = (films) => {
    const filmsListContainer = document.querySelector('.films-list__container');

    films.forEach((film) => this.#showFilmCard(filmsListContainer, film));
  }

  #showFilmDetails = async (film) => {
    this.#closeFilmDetails();

    await this.#commentsModel.init(film.id);
    this.#filmDetailsView = new FilmDetailsView(film, this.#commentsModel.comments);
    this.#filmDetailsView.setClickCloseHandler(this.#closeFilmDetails);
    this.#filmDetailsView.setClickControlsHandler(this.#handleDetailsControlClick);
    this.#filmDetailsView.setViewActionHandler(this.#handleViewAction);

    document.body.classList.add('hide-overflow');
    render(document.body, this.#filmDetailsView, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this.#handlePressEsc);
    document.addEventListener('keydown', this.#handleCtrlEnter);
  }

  #clearFilmsList = ({ resetRenderedTaskCount = false, resetSortType = false } = {}) => {
    this.#showMoreView.removeElement();
    this.#sortView.removeElement();
    this.#filmsView.removeElement();

    this.#filmCardsViews.forEach((filmCardView) => filmCardView.removeElement());
    this.#filmCardsViews.clear();

    if (resetSortType) {
      this.#filmSortType = FilmSortType.BY_DEFAULT;
    }

    if (resetRenderedTaskCount) {
      this.#showedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#showedFilmsCount = Math.min(this.films.length, this.#showedFilmsCount);
    }
  }

  #updateFilmCard = (update) => {
    if (this.#filmDetailsView !== null) {
      this.#filmDetailsView.updateData({ film: update, comments: this.#commentsModel.comments });
    }

    const oldFilmCardView = this.#filmCardsViews.get(update.id);

    const updatedFilmCardView = new FilmCardView(update);
    updatedFilmCardView.setClickControlsHandler(this.#handleCardControlClick);
    updatedFilmCardView.setClickOpenDetails(this.#showFilmDetails);
    this.#filmCardsViews.set(update.id, updatedFilmCardView);

    replace(oldFilmCardView, updatedFilmCardView);
  }

  #updatePopup = (update) => {
    this.#filmsModel.replaceFilm(update.film);

    this.#filmDetailsView.updateData({ film: update.film, comments: this.#commentsModel.comments });

    const oldFilmCardView = this.#filmCardsViews.get(update.film.id);

    const updatedFilmCardView = new FilmCardView(update.film);
    updatedFilmCardView.setClickControlsHandler(this.#handleCardControlClick);
    updatedFilmCardView.setClickOpenDetails(this.#showFilmDetails);
    this.#filmCardsViews.set(update.film.id, updatedFilmCardView);

    replace(oldFilmCardView, updatedFilmCardView);
  }

  #closeFilmDetails = () => {
    if (this.#filmDetailsView === null) {
      return;
    }

    this.#filmDetailsView.removeElement();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handlePressEsc);
    document.removeEventListener('keydown', this.#handleCtrlEnter);

    this.#filmDetailsView = null;
  }

  #handleLoadMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newShowedFilmsCount = Math.min(filmsCount, this.#showedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#showedFilmsCount, newShowedFilmsCount);

    this.#showFilmsPortion(films);
    this.#showedFilmsCount = newShowedFilmsCount;

    if (this.#showedFilmsCount >= filmsCount) {
      this.#showMoreView.removeElement();
    }
  }

  #handlePressEsc = (evt) => {
    if (isEscKey(evt)) {
      this.#closeFilmDetails();
    }
  }

  #handleCtrlEnter = (evt) => {
    if (isCtrlEnter(evt) && this.#filmDetailsView) {
      this.#filmDetailsView.initSendComment();
    }
  }

  #handleDetailsControlClick = (filmUpdate) => {
    this.#handleCardControlClick(filmUpdate);
  }

  #handleSortingChange = (sortingType) => {
    if (this.#filmSortType === sortingType) {
      return;
    }

    this.#filmSortType = sortingType;
    this.#clearFilmsList();
    this.#showFilms();
  }

  #handleCardControlClick = (filmUpdate) => {
    if (!filmUpdate.userDetails.watchlist && this.#filterModel.filter === FilmsFilterType.WATCHLIST ||
      !filmUpdate.userDetails.alreadyWatched && this.#filterModel.filter === FilmsFilterType.HISTORY ||
      !filmUpdate.userDetails.favorite && this.#filterModel.filter === FilmsFilterType.FAVORITES) {
      this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, filmUpdate);
    } else {
      this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, filmUpdate);
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        await this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        await this.#commentsModel.createComment(updateType, update);
        break;
      case UserAction.REMOVE_COMMENT:
        await this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  #handleModelNotification = (updateType, update) => {
    switch (updateType) {
      case UpdateType.POPUP:
        this.#updatePopup(update);
        break;
      case UpdateType.PATCH:
        this.#updateFilmCard(update);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsList();
        this.#showFilms();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsList({ resetRenderedTaskCount: true, resetSortType: true });
        this.#showFilms();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#loadingFilmsView.removeElement();
        this.#showContent();
        break;
    }
  }

}
