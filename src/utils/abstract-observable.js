export default class AbstractObservable {
  #observers = new Set();

  constructor() {
    if (new.target === AbstractObservable) {
      throw new Error('Can\'t instantiate AbstractObservable, only concrete one.');
    }
  }

  add(observer) {
    this.#observers.add(observer);
  }

  remove(observer) {
    this.#observers.delete(observer);
  }

  notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
