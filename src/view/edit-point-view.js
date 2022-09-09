import { getDestinationById, getDestinationByName, getMatchedOffersByName, getMatchedOffersByType, getNotSelectedOffers, getNotSelectedTypes, getRandomElement, getRandomInteger, getSelectedOffers } from '../utils';
import {TYPE_OF_TRANSPORT} from '../mock/const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

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
  const {point, allOffers, allTypes, newType, newDestination, newOffers, allDestinations} = infoPoint;
  //console.log(infoPoint)
  const {type, basePrice} = point;

  const matchedOffers = newType === null ? getMatchedOffersByType(allOffers, point.type) : getMatchedOffersByType(allOffers, newType);
  const selectedOffers = newType === null ? getSelectedOffers(matchedOffers.offers, point.offers) : '';
  const notSelectedOffers = selectedOffers.length === 0 ? matchedOffers.offers : getNotSelectedOffers(matchedOffers.offers, selectedOffers);
  const destination = newDestination === null ? getDestinationById(allDestinations, point.destination) : getDestinationByName(allDestinations, newDestination);

  //console.log(newOffers)
  //console.log(selectedOffers)
  //console.log(getMatchedOffersByName(matchedOffers.offers, newOffers))

  const destinationList = allDestinations.reduce((prev, current) => `
  ${prev}
  <option value=${current.name}></option>`, '');

  const offersListUnchecked = notSelectedOffers.reduce((prev, current) => `
  ${prev}
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${current.title}-1" type="checkbox" name="event-offer-${current.title}">
    <label class="event__offer-label" for="event-offer-${current.title}-1">
      <span class="event__offer-title">${current.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${current.price}</span>
    </label>
  </div>`, '');

  const offersListChecked = selectedOffers === '' ? '' : selectedOffers.reduce((prev, current) => `
  ${prev}
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${current.title}-1" type="checkbox" name="event-offer-${current.title}" checked>
    <label class="event__offer-label" for="event-offer-${current.title}-1">
      <span class="event__offer-title">${current.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${current.price}</span>
    </label>
  </div>`, '');

  //console.log(infoPoint)
  const destinationPhotos = destination.pictures.reduce((prev, photo) => `
  ${prev}
  <div class="event__photos-tape">
  <img class="event__photo" src=${photo.src} alt="Event photo">
  </div>`, '');

  const allTransportsList = newType === null ? getNotSelectedTypes(allTypes, type).reduce((prev, typeOfTransport) => `
  ${prev}
  <div class="event__type-item">
  <input id="event-type-${typeOfTransport}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOfTransport}">
  <label class="event__type-label  event__type-label--${typeOfTransport}" for="event-type-${typeOfTransport}-1">${typeOfTransport}</label>
  </div>`, '') : getNotSelectedTypes(allTypes, newType).reduce((prev, typeOfTransport) => `
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
          ${newType === null ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">` : `<img class="event__type-icon" width="17" height="17" src="img/icons/${newType}.png" alt="Event type icon">`}
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${newType === null ? `<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" checked>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
          </div>` : `<div class="event__type-item">
          <input id="event-type-${newType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${newType}" checked>
          <label class="event__type-label  event__type-label--${newType}" for="event-type-${newType}-1">${newType}</label>
        </div>`}
          ${allTransportsList}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        ${newType === null ? `<label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>` : `<label class="event__label  event__type-output" for="event-destination-1">
        ${newType}
        </label>`}
        ${newDestination === null ? `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1"/>` : `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${newDestination}" list="destination-list-1"></input>`}
        <datalist id="destination-list-1">
          ${destinationList}
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
        ${offersListUnchecked}
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
  constructor(infoPoint = BLANK_POINT) {
    super();
    this._state = EditPointView.parsePointToState(infoPoint);
    //console.log(this._state)
    this.#setInnerHandlers();
  }

  get template() {
    return CreateEditPointTemplate(this._state);
  }

  setSubmitFormHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setFormClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setResetFormHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.formSubmit);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeOfTransportChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#typeOfDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#typeOfOffersChangeHandler);
  };

  #typeOfTransportChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.updateElement({
      newType: evt.target.value
    });
  };

  #typeOfOffersChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    //const checkedInputs = evt.target.checked === true ? console.log("yes") : console.log("no");
    evt.preventDefault();
    for(const element of checkedInputs) {
      this.updateElement({
        newOffers: [element.name.replace(/event-offer-/i, '')]
      });
    }
    console.log(this._state)
  };

  #typeOfDestinationChangeHandler = (evt) => {
    evt.preventDefault();
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
    newOffers: []
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    if (point.newType !== point.point.type && point.newType !== null) {
      point.point.type = point.newType;
    }

    if (point.newDestination !== point.point.destination && point.newDestination !== null) {
      point.point.destination = point.newDestination;
    }

    if (point.newOffers !== point.point.offers) {
      point.point.offers = point.newOffers;
    }

    delete point.newType;
    delete point.newOffers;
    delete point.newDestination;

    return point;
  };
}
