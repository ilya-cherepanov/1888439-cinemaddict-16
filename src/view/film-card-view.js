import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { formatFilmDuration, formatReleaseYear, formatTotalRating, formatShortDescription } from '../utils/format.js';


dayjs.extend(duration);


const getControlActiveClass = (parameter) => (
  parameter ? 'film-card__controls-item--active' : ''
);


const createFilmCardTemplate = (film) => (
  `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${formatTotalRating(film.totalRating)}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatReleaseYear(film.release.date)}</span>
        <span class="film-card__duration">${formatFilmDuration(film)}</span>
        <span class="film-card__genre">${film.genre[0]}</span>
      </p>
      <img src="${film.poster}" alt="Poster of ${film.title}" class="film-card__poster">
      <p class="film-card__description">${formatShortDescription(film.description)}</p>
      <span class="film-card__comments">${film.comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlActiveClass(film.userDetails.watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlActiveClass(film.userDetails.alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${getControlActiveClass(film.userDetails.favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`
);


export { createFilmCardTemplate };
