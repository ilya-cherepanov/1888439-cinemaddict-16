import { FilmsFilterType, UpdateType, NavigationItemsType } from '../constants.js';
import { Filters } from '../utils/filters.js';
import { render, replace, RenderPosition } from '../utils/render.js';
import NavigationView from '../view/navigation/navigation-view.js';


export default class NavigationPresenter {
  #filterModel = null;
  #filmsModel = null;

  #isLoading = true;
  #navigationItemType = NavigationItemsType.FILMS;

  #navigationView = null;

  #navigationCallback = null;

  #containerElement = document.querySelector('.main');

  constructor(filterModel, filmsModel, navigationCallback) {
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#navigationCallback = navigationCallback;
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilmsFilterType.ALL,
        active: FilmsFilterType.ALL === this.#filterModel.filter,
        count: Filters[FilmsFilterType.ALL](films).length,
      },
      {
        type: FilmsFilterType.WATCHLIST,
        active: FilmsFilterType.WATCHLIST === this.#filterModel.filter,
        count: Filters[FilmsFilterType.WATCHLIST](films).length,
      },
      {
        type: FilmsFilterType.HISTORY,
        active: FilmsFilterType.HISTORY === this.#filterModel.filter,
        count: Filters[FilmsFilterType.HISTORY](films).length,
      },
      {
        type: FilmsFilterType.FAVORITES,
        active: FilmsFilterType.FAVORITES === this.#filterModel.filter,
        count: Filters[FilmsFilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    this.#filterModel.add(this.#handleModelNotification);
    this.#filmsModel.add(this.#handleModelNotification);

    this.#showNavigation();
  }

  #showNavigation = () => {
    const prevNavigationView = this.#navigationView;
    this.#navigationView = new NavigationView(this.filters, this.#navigationItemType);
    this.#navigationView.setFilterChangeHandler(this.#handleFilterChange);

    if (prevNavigationView === null) {
      render(this.#containerElement, this.#navigationView, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(prevNavigationView, this.#navigationView);
    prevNavigationView.removeElement();
  }

  #handleModelNotification = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
    }

    this.#showNavigation();
  }

  #handleNavigationChange = () => {
    if (this.#isLoading) {
      return;
    }

    this.#navigationCallback(this.#navigationItemType);
  }

  #handleFilterChange = (filterUpdate, navigationItemType) => {
    const isNavigationChanged = navigationItemType !== this.#navigationItemType;

    if (filterUpdate === this.#filterModel.filter && !isNavigationChanged) {
      return;
    }

    this.#navigationItemType = navigationItemType;
    if (isNavigationChanged) {
      this.#handleNavigationChange();
    }

    this.#filterModel.updateFilter(UpdateType.MAJOR, filterUpdate);
  }
}
