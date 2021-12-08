import {
  formatFilmRuntime,
  formatReleaseYear,
  formatTotalRating,
  formatShortDescription
} from '../utils/format.js';
import AbstractView from './abstract-view.js';
import FilmDetailsView from './film-details-view.js';
import { createComments } from '../mocking.js';
import { RenderPosition, render } from '../utils/render.js';


const getControlActiveClass = (parameter) => (
  parameter ? 'film-card__controls-item--active' : ''
);


const createFilmCardTemplate = (film) => {
  const filmInfo = film['film_info'];
  const userDetails = film['user_details'];

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${formatTotalRating(filmInfo['total_rating'])}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatReleaseYear(filmInfo.release.date)}</span>
        <span class="film-card__duration">${formatFilmRuntime(filmInfo.runtime)}</span>
        <span class="film-card__genre">${filmInfo.genre[0]}</span>
      </p>
      <img src="${filmInfo.poster}" alt="Poster of ${filmInfo.title}" class="film-card__poster">
      <p class="film-card__description">${formatShortDescription(filmInfo.description)}</p>
      <span class="film-card__comments">${film.comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlActiveClass(userDetails.watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlActiveClass(userDetails['already_watched'])}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${getControlActiveClass(userDetails.favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};


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
