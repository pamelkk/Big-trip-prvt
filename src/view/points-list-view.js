import AbstractView from '../framework/view/abstract-view';

const createListTripPointsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListPointsView extends AbstractView {
  get template() {
    return createListTripPointsTemplate();
  }

  setCreateNewPointHandler = (callback) => {
    this._callback.click = callback;
    this._callback.button = document.querySelector('.trip-main__event-add-btn');
    this._callback.button.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
    this._callback.button.disabled = true;
  };
}
