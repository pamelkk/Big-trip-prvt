import { getDestinationById, getDestinationByName, getMatchedOffersByType, getRandomElement, getRandomInteger, humanizeEditPointDateTime } from '../utils';
import {TYPE_OF_TRANSPORT} from '../mock/const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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
  const {point, allOffers, allTypes, newType, newDateFrom, newDateTo, newOffers, newDestination, allDestinations} = infoPoint;
  const {type, basePrice, dateFrom, dateTo} = point;

  const matchedOffers = !newType ? getMatchedOffersByType(allOffers, point.type) : getMatchedOffersByType(allOffers, newType);
  const destination = !newDestination ? getDestinationById(allDestinations, point.destination) : getDestinationByName(allDestinations, newDestination);
  const dateStart = dateFrom ? humanizeEditPointDateTime(dateFrom) : '';
  const dateEnd = dateTo ? humanizeEditPointDateTime(dateTo) : '';
  const newDateStart = newDateFrom ? humanizeEditPointDateTime(newDateFrom) : '';
  const newDateEnd = newDateTo ? humanizeEditPointDateTime(newDateTo) : '';

  const destinationList = allDestinations.reduce((prev, current) => `
  ${prev}
  <option value=${current.name}></option>`, '');

  const destinationPhotos = destination.pictures.reduce((prev, photo) => `
  ${prev}
  <div class="event__photos-tape">
  <img class="event__photo" src=${photo.src} alt="Event photo">
  </div>`, '');

  const offersList = matchedOffers.offers.reduce((prev, current) => {
    const offer = !newType || !newOffers ? point.offers : newOffers;
    const checked = offer.includes(current.id) ? 'checked' : '';
    return `
    ${prev}
    <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${current.id}" type="checkbox" name="event-offer-${type}" ${checked}>
    <label class="event__offer-label" for="event-offer-${current.id}">
    <span class="event__offer-title">${current.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${current.price}</span>
    </label>
  </div>`;}, '');

  const transportList = allTypes.reduce((prev, typeOfTransport) => {
    const transport = !newType ? point.type : newType;
    const checked = transport.includes(typeOfTransport) ? 'checked' : '';
    return `
    ${prev}
    <div class="event__type-item">
    <input id="event-type-${typeOfTransport}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOfTransport}" ${checked}>
    <label class="event__type-label  event__type-label--${typeOfTransport}" for="event-type-${typeOfTransport}-1">${typeOfTransport}</label>
  </div>`;}, '');

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          ${!newType ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">` : `<img class="event__type-icon" width="17" height="17" src="img/icons/${newType}.png" alt="Event type icon">`}
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${transportList}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        ${!newType ? `<label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>` : `<label class="event__label  event__type-output" for="event-destination-1">
        ${newType}
        </label>`}
        ${!newDestination ? `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1"/>` : `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${newDestination}" list="destination-list-1"></input>`}
        <datalist id="destination-list-1">
          ${destinationList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        ${!newDateFrom ? `<input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}"/>` : `<input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${newDateStart}"/>`}
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        ${!newDateTo ? `<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}"/>` : `<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${newDateEnd}"/>`}
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value=${basePrice}>
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
        ${offersList}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        <div class="event__photos-container">
        ${destinationPhotos}
        </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor(infoPoint = BLANK_POINT) {
    super();
    this._state = EditPointView.parsePointToState(infoPoint);
    //console.log(this._state.point.offers)
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.#setInnerHandlers();
  }

  get template() {
    return CreateEditPointTemplate(this._state);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  };

  reset = (infoPoint) => {
    this.updateElement(
      EditPointView.parsePointToState(infoPoint),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.formSubmit);
    this.setFormClickHandler(this._callback.click);
    this.setResetFormHandler(this._callback.formReset);
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  };

  setSubmitFormHandler = (callback) => {
    this._callback.formSubmit = callback;
  };

  setFormClickHandler = (callback) => {
    this._callback.click = callback;
  };

  setResetFormHandler = (callback) => {
    this._callback.formReset = callback;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeOfTransportChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#typeOfDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#typeOfOffersChangeHandler);
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #setStartDatepicker = () => {
    if (this._state.point.dateFrom) {
      this.#datepickerStart = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
  };

  #setEndDatepicker = () => {
    if (this._state.point.dateTo) {
      this.#datepickerEnd = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          minDate: !this._state.newDateFrom ? humanizeEditPointDateTime(this._state.point.dateFrom) : humanizeEditPointDateTime(this._state.newDateFrom),
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      newDateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      newDateTo: userDate,
    });
  };

  #typeOfTransportChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    this.updateElement({
      newType: evt.target.value,
    });
  };

  #typeOfOffersChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    const clickedOfferNumber = Number(evt.target.id.replace(/event-offer-/i, ''));
    let selectedOffers = [...this._state.point.offers];
    const addSelectedOffer = (all, number) => all.push(number);
    const removeSelectedOffer = (all, number) => all.filter((item) => item !== number);
    //Или такой вариант думала:
    //const result = selectedOffers.includes(clickedOfferNumber) ? removeSelectedOffer(selectedOffers, clickedOfferNumber) : addSelectedOffer(selectedOffers, clickedOfferNumber);

    if(selectedOffers.length === 0) {
      if(selectedOffers.includes(clickedOfferNumber)) {
        selectedOffers = removeSelectedOffer(selectedOffers, clickedOfferNumber);
      } else {
        selectedOffers = addSelectedOffer(selectedOffers, clickedOfferNumber);
      }
    } else {
      selectedOffers = addSelectedOffer(selectedOffers, clickedOfferNumber);
    }

    this.updateElement({
      newOffers: selectedOffers
    });
  };

  #typeOfDestinationChangeHandler = (evt) => {
    this.updateElement({
      newDestination: evt.target.value,
    });
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  static parsePointToState = (infoPoint) => ({...infoPoint,
    newType: null,
    newDestination: null,
    newOffers: [],
    newDateFrom: null,
    newDateTo: null,
  });

  static parseStateToPoint = (state) => {
    const newState = {...state};

    if (newState.newType && newState.newType !== newState.point.type) {
      newState.point.type = newState.newType;
    }

    if (newState.newDestination) {
      newState.newDestination = (getDestinationByName(newState.allDestinations, newState.newDestination)).id;
      if (newState.newDestination !== newState.point.destination) {
        newState.point.destination = newState.newDestination;
      }
    }

    if (newState.newOffers !== newState.point.offers) {
      newState.point.offers = newState.newOffers;
    }

    if (newState.newDateFrom && newState.newDateFrom !== newState.point.dateFrom) {
      newState.point.dateFrom = newState.newDateFrom;
    }

    if (newState.newDateTo && newState.newDateTo !== newState.point.dateTo) {
      newState.point.dateTo = newState.newDateTo;
    }

    delete newState.newType;
    delete newState.newOffers;
    delete newState.newDestination;
    delete newState.newDateFrom;
    delete newState.newDateTo;

    return newState;
  };
}
