import AbstractView from './abstract-view.js';
import { replace } from '../utils/render.js';

export default class SmartView extends AbstractView {
  _state = null;

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateState(updating, isJustStateUpdate) {
    if (!updating) {
      return;
    }

    this._state = { ...this._state, ...updating };

    if (isJustStateUpdate) {
      return;
    }

    this.updateElements();
  }

  updateElements() {
    const prevElement = this.element;

    this.clearElement();

    const newElement = this.element;

    replace(prevElement, newElement);

    this.restoreHandlers();
  }
}
