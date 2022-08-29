import AbstractView from '../framework/view/abstract-view';
import { getRandomElement, getRandomInteger } from '../utils';
import {TYPE_OF_TRANSPORT} from '../mock/const';

const BLANK_POINT = {
  basePrice: getRandomInteger(100, 2000),
  dateFrom: '2019-07-11T22:55:56.845Z',
  dateTo: '2019-07-16T11:22:13.375Z',
  destination: getRandomInteger(1, 3),
  id: '0',
  offers: [1],
  type: getRandomElement(TYPE_OF_TRANSPORT),
};

const CreateEditPointTemplate = (infoPoint) => {
  const points = infoPoint[0];
  const allOffers = infoPoint[1];
  const allTypes = infoPoint[2];

  const {type, basePrice, offers, destination} = points;

  const offersList = allOffers.reduce((prev, current) => `
  ${prev}
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${current.title}-1" type="checkbox" name="event-offer-${current.title}">
    <label class="event__offer-label" for="event-offer-${current.title}-1">
      <span class="event__offer-title">${current.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${current.price}</span>
    </label>
  </div>`, '');

  const offersListChecked = offers.reduce((prev, current) => `
  ${prev}
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${current.title}-1" type="checkbox" name="event-offer-${current.title}" checked>
    <label class="event__offer-label" for="event-offer-${current.title}-1">
      <span class="event__offer-title">${current.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${current.price}</span>
    </label>
  </div>`, '');

  const eventsList = allTypes.reduce((prev, typeOfTransport) => `
  ${prev}
  <div class="event__type-item">
  <input id="event-type-${typeOfTransport}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOfTransport}">
  <label class="event__type-label  event__type-label--${typeOfTransport}" for="event-type-${typeOfTransport}-1">${typeOfTransport}</label>
</div>`, '');

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventsList}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination.name} list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offersListChecked}
        ${offersList}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
      </section>
    </section>
  </form>
</li>`;
};

export default class EditPointView extends AbstractView {
  #infoPoint = null;

  constructor(infoPoint = BLANK_POINT) {
    super();
    this.#infoPoint = infoPoint;
  }

  get template() {
    return CreateEditPointTemplate(this.#infoPoint);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('form').addEventListener('submit', this.#clickHandler);
  };

  setFormClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setResetFormHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('reset', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
