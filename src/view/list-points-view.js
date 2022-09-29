import AbstractView from '../framework/view/abstract-view';

const createListTripPointsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListPointsView extends AbstractView {
  constructor() {
    super();
    this.#setInnerHandlers();
  }

  get template() {
    return createListTripPointsTemplate();
  }

  #setInnerHandlers = () => {
    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#clickHandler);
  };

  setCreateNewPointHandler = (callback) => {
    this._callback.createPoint = callback;
    this._callback.button = document.querySelector('.trip-main__event-add-btn');
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.createPoint();
    this._callback.button.disabled = true;
  };
}
