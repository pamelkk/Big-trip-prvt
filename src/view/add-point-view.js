import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDestinationById, getDestinationByName, getMatchedOffersByType, getNotSelectedOffers, getNotSelectedTypes, getSelectedOffers } from '../utils';

const createAddPointTemplate = (infoRandomPoint) => {
  const {point, allOffers, allTypes, newType, newDestination, allDestinations} = infoRandomPoint;

  const {type, basePrice} = point;

  const matchedOffers = newType === null ? getMatchedOffersByType(allOffers, point.type) : getMatchedOffersByType(allOffers, newType);
  const selectedOffers = newType === null ? getSelectedOffers(matchedOffers.offers, point.offers) : '';
  const notSelectedOffers = selectedOffers.length === 0 ? matchedOffers.offers : getNotSelectedOffers(matchedOffers.offers, selectedOffers);
  const destination = newDestination === null ? getDestinationById(allDestinations, point.destination) : getDestinationByName(allDestinations, newDestination);

  const destinationList = allDestinations.reduce((prev, current) => `
  ${prev}
  <option value=${current.name}></option>`, '');

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

  const destinationPhotos = destination.pictures.reduce((prev, photo) => `
  ${prev}
  <div class="event__photos-tape">
  <img class="event__photo" src=${photo.src} alt="Event photo">
  </div>`, '');

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
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;${basePrice}
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
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

export default class AddPointView extends AbstractStatefulView {
  constructor(infoRandomPoint) {
    super();
    this._state = AddPointView.parsePointToState(infoRandomPoint);
    this.#setInnerHandlers();
  }

  get template() {
    return createAddPointTemplate(this._state);
  }

  setResetNewPointFormHandler = (callback) => {
    this._callback.formReset = callback;
    this._callback.button = document.querySelector('.trip-main__event-add-btn');
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
  };

  setSubmitNewPointFormHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.formSubmit);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeOfTransportChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#typeOfDestinationChangeHandler);
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

  #typeOfDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      newDestination: evt.target.value,
    });
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
    this._callback.button.disabled = false;
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.button.disabled = false;
    this._callback.formSubmit(AddPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = (infoPoint) => ({...infoPoint,
    newType: null,
    newDestination: null,
    newOffers: []
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    if (point.newType !== point.point.type) {
      point.point.type = point.newType;
    }

    if (point.newDestination !== point.point.destination) {
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
