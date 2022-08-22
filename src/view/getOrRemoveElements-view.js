import { createElement } from '../render';

export default class GetRemoveElement {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
