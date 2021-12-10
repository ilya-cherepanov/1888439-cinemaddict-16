import AbstractView from '../abstract-view.js';
import { createProfileTemplate } from './profile-view.tmpl.js';


export default class ProfileView extends AbstractView {
  #films = null;

  constructor(films) {
    super();

    this.#films = films;
  }

  get template() {
    return createProfileTemplate(this.#films);
  }
}
