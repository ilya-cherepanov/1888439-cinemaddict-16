import AbstractView from '../abstract-view.js';
import { createFilmsListExtraTemplate } from './films-list-extra.tmpl.js';


export default class FilmsListExtraView extends AbstractView {
  #listType = null;

  constructor (listType) {
    super();

    this.#listType = listType;
  }

  get template() {
    return createFilmsListExtraTemplate(this.#listType);
  }
}
