import AbstractView from '../abstract-view.js';
import { createFilmDetailsTemplate } from './film-details-view.tmpl.js';


const ESC_KEY_CODE = 27;


const isEscKey = (evt) => evt.keyCode === ESC_KEY_CODE;


export default class FilmDetailsView extends AbstractView {
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();

    this.#film = film;
    this.#comments = comments;

    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickCloseHandler);
    document.addEventListener('keydown', this.#pressEscHandler);
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments);
  }

  closeFilmDetails = () => {
    this.removeElement();
    document.body.classList.remove('hide-overflow');
  }

  #pressEscHandler = (evt) => {
    if (isEscKey(evt)) {
      this.closeFilmDetails();
    }
  }

  #clickCloseHandler = (evt) => {
    evt.preventDefault();
    this.closeFilmDetails();
  }
}
