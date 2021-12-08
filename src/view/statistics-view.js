import { formatFilmsCount } from '../utils/format.js';
import AbstractView from './abstract-view.js';


const createStatisticsTemplate = (filmsCount) => `<p>${formatFilmsCount(filmsCount)} movies inside</p>`;


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
