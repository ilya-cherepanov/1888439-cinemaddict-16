import {
  formatFilmRuntime,
  formatReleaseYear,
  formatTotalRating,
  formatShortDescription
} from '../../utils/format.js';


const getControlActiveClass = (parameter) => (
  parameter ? 'film-card__controls-item--active' : ''
);


const createFilmCardTemplate = ({ filmInfo, userDetails, comments }) => (
  `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${formatTotalRating(filmInfo.totalRating)}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatReleaseYear(filmInfo.release.date)}</span>
        <span class="film-card__duration">${formatFilmRuntime(filmInfo.runtime)}</span>
        <span class="film-card__genre">${filmInfo.genre[0]}</span>
      </p>
      <img src="${filmInfo.poster}" alt="Poster of ${filmInfo.title}" class="film-card__poster">
      <p class="film-card__description">${formatShortDescription(filmInfo.description)}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlActiveClass(userDetails.watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlActiveClass(userDetails.alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${getControlActiveClass(userDetails.favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`
);


export { createFilmCardTemplate };
