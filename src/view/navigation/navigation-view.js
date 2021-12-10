import AbstractView from '../abstract-view.js';
import { createNavigationTemplate } from './navigation-view.tmpl.js';


export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();

    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
