export default class AbstractView {
  #element = null;
  _callbacks = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = this.#createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  clearElement = () => {
    if (this.#element !== null) {
      this.#element = null;
    }
  }

  removeElement = () => {
    if (this.#element !== null) {
      this.#element.remove();
      this.clearElement();
    }
  }

  #createElement = (template) => {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;

    return newElement.firstElementChild;
  }
}
