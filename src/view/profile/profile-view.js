import AbstractView from '../abstract-view.js';
import { createProfileTemplate } from './profile-view.tmpl.js';


export default class ProfileView extends AbstractView {
  #watchedFilmsCount = null;

  constructor(watchedFilmsCount) {
    super();

    this.#watchedFilmsCount = watchedFilmsCount;
  }

  get template() {
    return createProfileTemplate(this.#watchedFilmsCount);
  }
}
