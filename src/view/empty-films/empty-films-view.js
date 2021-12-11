import AbstractView from '../abstract-view.js';
import { createEmptyFilmsTemplate } from './empty-films-view.tmpl.js';


export default class EmptyFilmsView extends AbstractView {
  #filmsFilterType = null;

  constructor(filmsFilterType) {
    super();

    this.#filmsFilterType = filmsFilterType;
  }

  get template() {
    return createEmptyFilmsTemplate(this.#filmsFilterType);
  }
}
