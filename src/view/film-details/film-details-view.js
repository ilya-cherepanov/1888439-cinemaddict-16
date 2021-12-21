import AbstractView from '../abstract-view.js';
import { createFilmDetailsTemplate } from './film-details-view.tmpl.js';


export default class FilmDetailsView extends AbstractView {
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();

    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments);
  }

  setClickCloseHandler = (handler) => {
    this._callbacks.clickClose = handler;

    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickCloseHandler);
  }

  setClickControlsHandler = (handler) => {
    this._callbacks.clickControl = handler;

    const controls = this.element.querySelectorAll('.film-details__control-button');
    controls.forEach(
      (control) => control.addEventListener('click', this.#clickControlHandler)
    );
  }

  #clickControlHandler = (evt) => {
    evt.preventDefault();
    const { target } = evt;

    const filmUpdate = {...this.#film};
    if (target.classList.contains('film-details__control-button--favorite')) {
      filmUpdate.userDetails.favorite = !this.#film.userDetails.favorite;
    } else if (target.classList.contains('film-details__control-button--watchlist')) {
      filmUpdate.userDetails.watchlist = !this.#film.userDetails.watchlist;
    } else if (target.classList.contains('film-details__control-button--watched')) {
      filmUpdate.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    }

    this._callbacks.clickControl(filmUpdate, this.#comments);
  };

  #clickCloseHandler = (evt) => {
    evt.preventDefault();

    this._callbacks.clickClose();
  }
}
