import AbstractView from '../abstract-view.js';
import { createStatisticsTemplate } from './statistics-view.tmpl.js';


export default class StatisticsView extends AbstractView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();

    this.#filmsCount = filmsCount;
  }

  get template() {
    return createStatisticsTemplate(this.#filmsCount);
  }
}
