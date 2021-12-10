import AbstractView from '../abstract-view.js';
import { createFilmCardTemplate } from './film-card-view.tmpl.js';
import FilmDetailsView from '../film-details/film-details-view.js';
import { createComments } from '../../mocking.js';
import { RenderPosition, render } from '../../utils/render.js';


export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();

    this.#film = film;

    this.element
      .querySelector('.film-card__link')
      .addEventListener('click', this.#clickDetailsHandler);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  #clickDetailsHandler = (evt) => {
    evt.preventDefault();
    const comments = createComments(this.#film.comments);
    const filmDetailsView = new FilmDetailsView(this.#film, comments);
    document.body.classList.add('hide-overflow');
    render(document.body, filmDetailsView.element, RenderPosition.BEFOREEND);
  };
}
