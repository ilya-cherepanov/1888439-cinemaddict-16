import AbstractView from '../abstract-view.js';
import { createFilmCardTemplate } from './film-card-view.tmpl.js';


export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();

    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setClickOpenDetails = (handler) => {
    this._callbacks.clickOpenDetails = handler;

    this.element
      .querySelector('.film-card__link')
      .addEventListener('click', this.#clickDetailsHandler);
  }

  setClickControlsHandler = (handler) => {
    this._callbacks.clickControl = handler;

    const controls = this.element.querySelectorAll('.film-card__controls-item');
    controls.forEach(
      (control) => control.addEventListener('click', this.#clickControlHandler)
    );
  }

  #clickControlHandler = (evt) => {
    evt.preventDefault();
    const { target } = evt;

    const filmUpdate = {...this.#film};
    if (target.classList.contains('film-card__controls-item--favorite')) {
      filmUpdate.userDetails.favorite = !this.#film.userDetails.favorite;
    } else if (target.classList.contains('film-card__controls-item--add-to-watchlist')) {
      filmUpdate.userDetails.watchlist = !this.#film.userDetails.watchlist;
    } else if (target.classList.contains('film-card__controls-item--mark-as-watched')) {
      filmUpdate.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    }

    this._callbacks.clickControl(filmUpdate);
  }

  #clickDetailsHandler = (evt) => {
    evt.preventDefault();

    this._callbacks.clickOpenDetails(this.#film);
  }
}
