import { render, replace, RenderPosition } from '../utils/render.js';
import { UpdateType } from '../constants.js';
import FilmCounterView from '../view/film-counter/film-counter-view.js';
import ProfileView from '../view/profile/profile-view.js';


export default class HeaderFooterPresenter {
  #filmsModel = null;

  #filmCounterView = null;
  #profileView = null;

  #headerElement = document.querySelector('.header');
  #footerStatisticsElement = document.querySelector('.footer__statistics');

  constructor(filmsModel) {
    this.#filmsModel = filmsModel;

    this.init();
  }

  get watchedFilms() {
    return this.#filmsModel.films.filter((film) => film.userDetails.alreadyWatched);
  }

  init = () => {
    this.#filmsModel.add(this.#handleModelNotification);

    this.#showFilmCounter();
  }

  #showFilmCounter = () => {
    this.#filmCounterView = new FilmCounterView(0);

    render(this.#footerStatisticsElement, this.#filmCounterView, RenderPosition.BEFOREEND);
  }

  #updateFilmCounter = () => {
    const oldFilmCounterView = this.#filmCounterView;
    this.#filmCounterView = new FilmCounterView(this.#filmsModel.films.length);
    replace(oldFilmCounterView, this.#filmCounterView);
  }

  #showProfile = () => {
    const watchedFilmsCount = this.watchedFilms.length;

    if (watchedFilmsCount === 0) {
      return;
    }

    this.#profileView = new ProfileView(watchedFilmsCount);
    render(this.#headerElement, this.#profileView, RenderPosition.BEFOREEND);
  }

  #updateProfile = () => {
    if (this.#profileView === null) {
      this.#showProfile();
      return;
    }

    const watchedFilmsCount = this.watchedFilms.length;

    if (watchedFilmsCount === 0) {
      this.#profileView.removeElement();
      this.#profileView = null;
      return;
    }

    const oldProfileView = this.#profileView;
    this.#profileView = new ProfileView(watchedFilmsCount);
    replace(oldProfileView, this.#profileView);
  }

  #handleModelNotification = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.#updateFilmCounter();
      this.#showProfile();
      return;
    }

    this.#updateProfile();
  }
}
