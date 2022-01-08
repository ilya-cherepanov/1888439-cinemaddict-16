import AbstractView from '../abstract-view.js';
import { createNavigationTemplate } from './navigation-view.tmpl.js';
import { FilmsFilterType } from '../../constants.js';


export default class NavigationView extends AbstractView {
  #filters = null;
  #activeFilterType = null;

  constructor(filters, activeFilterType) {
    super();

    this.#filters = filters;
    this.#activeFilterType = activeFilterType;
  }

  get navigation() {
    return {};
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#activeFilterType);
  }

  setFilterChangeHandler = (handler) => {
    this._callbacks.changeFilter = handler;
    const filterElements = this.element.querySelectorAll('.main-navigation__item');
    filterElements.forEach(
      (filterElement) => filterElement.addEventListener('click', this.#handleChangeFilter)
    );
  }

  #handleChangeFilter = (evt) => {
    evt.preventDefault();

    switch (evt.target.hash) {
      case '#all':
        this._callbacks.changeFilter(FilmsFilterType.ALL);
        break;
      case '#watchlist':
        this._callbacks.changeFilter(FilmsFilterType.WATCHLIST);
        break;
      case '#history':
        this._callbacks.changeFilter(FilmsFilterType.HISTORY);
        break;
      case '#favorites':
        this._callbacks.changeFilter(FilmsFilterType.FAVORITES);
        break;
    }
  }
}
