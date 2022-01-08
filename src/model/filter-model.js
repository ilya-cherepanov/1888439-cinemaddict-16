import AbstractObservable from '../utils/abstract-observable.js';
import { FilmsFilterType } from '../constants.js';


export default class FilterModel extends AbstractObservable {
  #filter = FilmsFilterType.ALL;

  get filter() {
    return this.#filter;
  }

  updateFilter(updateType, filter) {
    this.#filter = filter;

    this.notify(updateType, filter);
  }
}
