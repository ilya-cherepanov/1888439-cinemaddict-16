import AbstractView from '../abstract-view.js';
import { createNavigationTemplate } from './navigation-view.tmpl.js';
import { FilmsFilterType, NavigationItemsType } from '../../constants.js';


export default class NavigationView extends AbstractView {
  #filters = null;
  #navigationItemType = null;

  constructor(filters, navigationItemType) {
    super();

    this.#filters = filters;
    this.#navigationItemType = navigationItemType;
  }

  get navigation() {
    return {};
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#navigationItemType);
  }

  setFilterChangeHandler = (handler) => {
    this._callbacks.changeFilter = handler;

    const filterElements = this.element.querySelectorAll('.main-navigation__item');
    filterElements.forEach(
      (filterElement) => filterElement.addEventListener('click', this.#handleChangeFilter)
    );

    const navigationElements = this.element.querySelectorAll('.main-navigation__additional');
    navigationElements.forEach(
      (navigationElement) => navigationElement.addEventListener('click', this.#handleChangeFilter)
    );
  }

  #handleChangeFilter = (evt) => {
    evt.preventDefault();

    switch (evt.target.hash) {
      case '#all':
        this._callbacks.changeFilter(FilmsFilterType.ALL, NavigationItemsType.FILMS);
        break;
      case '#watchlist':
        this._callbacks.changeFilter(FilmsFilterType.WATCHLIST, NavigationItemsType.FILMS);
        break;
      case '#history':
        this._callbacks.changeFilter(FilmsFilterType.HISTORY, NavigationItemsType.FILMS);
        break;
      case '#favorites':
        this._callbacks.changeFilter(FilmsFilterType.FAVORITES, NavigationItemsType.FILMS);
        break;
      case '#stats':
        this._callbacks.changeFilter(FilmsFilterType.NOTHING, NavigationItemsType.STATISTICS);
        break;
    }
  }
}
