import { createElement } from '../render';

const createListTripEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListEventsView {
  getTemplate() {
    return createListTripEventsTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
