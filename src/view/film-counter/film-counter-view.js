import AbstractView from '../abstract-view.js';
import { createFilmCounterTemplate } from './film-counter-view.tmpl.js';


export default class FilmCounterView extends AbstractView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();

    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFilmCounterTemplate(this.#filmsCount);
  }
}
