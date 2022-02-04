import AbstractView from '../abstract-view.js';
import { createSortTemplate } from './sort-view.tmpl.js';


export default class SortView extends AbstractView {
  #filmSortType = null;

  constructor(filmSortType) {
    super();

    this.#filmSortType = filmSortType;
  }

  get template() {
    return createSortTemplate(this.#filmSortType);
  }

  setSortingChangeHandler = (sortHandler) => {
    this._callbacks.sortHandler = sortHandler;

    const sortButtons = this.element.querySelectorAll('.sort__button');
    sortButtons.forEach(
      (sortButton) => sortButton.addEventListener('click', this.#changeSortingHandler)
    );
  }

  #changeSortingHandler = (evt) => {
    evt.preventDefault();

    this._callbacks.sortHandler(evt.target.dataset.sortType);
  }
}
