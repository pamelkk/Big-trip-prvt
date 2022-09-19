import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDestinationById, getDestinationByName, getMatchedOffersByType, humanizeEditPointDateTime } from '../utils';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createAddPointTemplate = (infoRandomPoint) => {
  const {point, allOffers, allTypes, allDestinations} = infoRandomPoint;
  const {type, basePrice, dateFrom, dateTo} = point;

  const matchedOffers = getMatchedOffersByType(allOffers, point.type);
  const destination = getDestinationById(allDestinations, point.destination);
  const dateStart = dateFrom ? humanizeEditPointDateTime(dateFrom) : '';
  const dateEnd = dateTo ? humanizeEditPointDateTime(dateTo) : '';

  const destinationList = allDestinations.reduce((prev, current) => `
  ${prev}
  <option value=${current.name}></option>`, '');

  const destinationPhotos = destination.pictures.reduce((prev, photo) => `
  ${prev}
  <div class="event__photos-tape">
  <img class="event__photo" src=${photo.src} alt="Event photo">
  </div>`, '');

  const offersList = matchedOffers.offers.reduce((prev, current) => {
    const checked = point.offers.includes(current.id) ? 'checked' : '';
    return `
    ${prev}
    <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${current.title}-1" type="checkbox" name="event-offer-${current.title}" ${checked}>
    <label class="event__offer-label" for="event-offer-${current.title}-1">
    <span class="event__offer-title">${current.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${current.price}</span>
    </label>
  </div>`;}, '');

  const transportList = allTypes.reduce((prev, typeOfTransport) => {
    const checked = point.type.includes(typeOfTransport) ? 'checked' : '';
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
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1"/>
        <datalist id="destination-list-1">
        ${destinationList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}"/>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}"/>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value=${basePrice}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
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

export default class AddPointView extends AbstractStatefulView {
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor(infoRandomPoint) {
    super();
    this._state = AddPointView.parsePointToState(infoRandomPoint);
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.#setInnerHandlers();
  }

  get template() {
    return createAddPointTemplate(this._state);
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
      AddPointView.parsePointToState(infoPoint),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitNewPointFormHandler(this._callback.formSubmit);
    this.setResetNewPointFormHandler(this._callback.formReset);
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  };

  setResetNewPointFormHandler = (callback) => {
    this._callback.formReset = callback;
    this._callback.button = document.querySelector('.trip-main__event-add-btn');
  };

  setSubmitNewPointFormHandler = (callback) => {
    this._callback.formSubmit = callback;
    this._callback.button = document.querySelector('.trip-main__event-add-btn');
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeOfTransportChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#typeOfDestinationChangeHandler);
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#typeOfOffersChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
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
          minDate: humanizeEditPointDateTime(this._state.point.dateFrom),
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      },
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      },
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value,
      },
    });
  };

  #typeOfTransportChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    this.updateElement(
      AddPointView.parseStateToPoint({
        point: {
          ...this._state.point,
          type: evt.target.value,
          offers: [],
        },
      })
    );
  };

  #typeOfOffersChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    const clickedOfferNumber = Number(evt.target.id.replace(/event-offer-/i, ''));
    let selectedOffers = [...this._state.point.offers];
    const removeSelectedOffer = (all, number) => all.filter((item) => item !== number);

    selectedOffers = selectedOffers.includes(clickedOfferNumber) ? removeSelectedOffer(selectedOffers, clickedOfferNumber) : selectedOffers.push(clickedOfferNumber);

    this.updateElement(
      AddPointView.parseStateToPoint({
        point: {
          ...this._state.point,
          offers: [selectedOffers],
        },
      })
    );
  };

  #typeOfDestinationChangeHandler = (evt) => {
    this.updateElement(
      AddPointView.parseStateToPoint({
        point: {
          ...this._state.point,
          destination: getDestinationByName(this._state.allDestinations, evt.target.value).id
        },
      })
    );
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset(AddPointView.parseStateToPoint(this._state));
    this._callback.button.disabled = false;
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.button.disabled = false;
    this._callback.formSubmit(AddPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = (infoPoint) => ({...infoPoint});

  static parseStateToPoint = (state) => {
    const newState = {...state};
    return newState;
  };
}
