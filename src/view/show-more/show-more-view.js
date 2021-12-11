import AbstractView from '../abstract-view.js';
import { createShowMoreTemplate } from './show-more-view.tmpl.js';


export default class ShowMoreView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createShowMoreTemplate();
  }

  setClickHandler = (callback) => {
    this._callbacks.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callbacks.click(evt);
  };
}
