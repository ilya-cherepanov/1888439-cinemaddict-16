import { FilmsFilterType } from '../constants.js';
import { Filters } from '../utils/filters.js';
import { render, replace, RenderPosition } from '../utils/render.js';
import NavigationView from '../view/navigation/navigation-view.js';


export default class NavigationPresenter {
  #filterModel = null;
  #filmsModel = null;

  #navigationView = null;

  #containerElement = document.querySelector('.main');

  constructor(filterModel, filmsModel) {
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilmsFilterType.ALL,
        count: Filters[FilmsFilterType.ALL](films).length,
      },
      {
        type: FilmsFilterType.FAVORITES,
        count: Filters[FilmsFilterType.FAVORITES](films).length,
      },
      {
        type: FilmsFilterType.HISTORY,
        count: Filters[FilmsFilterType.HISTORY](films).length,
      },
      {
        type: FilmsFilterType.WATCHLIST,
        count: Filters[FilmsFilterType.WATCHLIST](films).length,
      },
    ];
  }

  init = () => {
    const prevNavigationView = this.#navigationView;
    this.#navigationView = new NavigationView(this.filters, this.#filterModel.filter);
    this.#navigationView.setFilterChangeHandler(this.#handleFilterChange);

    this.#filterModel.add(this.#handleModelNotification);
    this.#filmsModel.add(this.#handleModelNotification);

    if (prevNavigationView === null) {
      render(this.#containerElement, this.#navigationView, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(prevNavigationView, this.#navigationView);
    prevNavigationView.remove();
  }

  destroy = () => {
  }

  #handleModelNotification = () => {
    this.init();
  }

  #handleFilterChange = (filterUpdate) => {
    this.#filterModel.updateFilter('all', filterUpdate);
  }
}
