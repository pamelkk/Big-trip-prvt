import AbstractView from '../framework/view/abstract-view';

const createNewEventButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewEventButtonView extends AbstractView {
  constructor() {
    super();
    this.#setInnerHandlers();
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  setCreateNewPointHandler = (callback) => {
    this._callback.createPoint = callback;
    this._callback.button = this.element;
  };

  #setInnerHandlers = () => {
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.createPoint();
    this._callback.button.disabled = true;
  };
}
