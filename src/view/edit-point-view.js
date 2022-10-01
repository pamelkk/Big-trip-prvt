import { getDestinationById, getDestinationByName, getMatchedOffersByType, getRandomElement, getRandomInteger, humanizeEditPoint, humanizeEditPointDateTime } from '../utils';
import {TYPE_OF_TRANSPORT} from '../mock/const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: Number(getRandomInteger(100, 2000)),
  dateFrom: '2019-07-11T22:55:56.845',
  dateTo: '2019-07-16T11:22:13.375',
  destination: getRandomInteger(1, 3),
  id: null,
  isFavorite: true,
  offers: [1],
  type: getRandomElement(TYPE_OF_TRANSPORT),
};

const CreateEditPointTemplate = (point, allOffers, allDestinations, formType) => {
  const {type, basePrice, dateFrom, dateTo} = point;

  const matchedOffers = getMatchedOffersByType(allOffers, point);
  const destination = getDestinationById(allDestinations, point);
  const dateStart = dateFrom ? humanizeEditPointDateTime(dateFrom) : '';
  const dateEnd = dateTo ? humanizeEditPointDateTime(dateTo) : '';

  const destinationList = allDestinations.reduce((prev, current) => `
  ${prev}
  <option value="${current.name}"></option>`, '');

  const destinationPhotos = destination.pictures.reduce((prev, photo) => `
  ${prev}<img class="event__photo" src=${photo.src} alt="Event photo">`, '');

  const offersList = matchedOffers.offers.reduce((prev, current) => {
    const checked = point.offers.includes(current.id) ? 'checked' : '';
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

  const transportList = TYPE_OF_TRANSPORT.reduce((prev, typeOfTransport) => {
    const checked = point.type.includes(typeOfTransport) ? 'checked' : '';
    return `
    ${prev}
    <div class="event__type-item">
    <input id="event-type-${typeOfTransport}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOfTransport}" ${checked}>
    <label class="event__type-label  event__type-label--${typeOfTransport}" for="event-type-${typeOfTransport}-1">${typeOfTransport}</label>
  </div>`;}, '');

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <p class="event--error"></p>
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
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="1" value=${basePrice}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${formType}</button>
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
        <div class="event__photos-tape">
        ${destinationPhotos}
        </div>
        </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #datepickerStart = null;
  #datepickerEnd = null;
  #offers = [];
  #destinations = [];
  #formType = null;

  constructor(infoPoint, offers, destinations, formType) {
    super();
    if (!infoPoint) {
      infoPoint = BLANK_POINT;
    }
    this.#offers = offers;
    this.#destinations = destinations;
    this.#formType = formType;
    this._state = EditPointView.parsePointToState(infoPoint);
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.#setInnerHandlers();
  }

  get template() {
    return CreateEditPointTemplate(this._state, this.#offers, this.#destinations, this.#formType);
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
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
  };

  #setStartDatepicker = () => {
    if (this._state.dateFrom) {
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
    if (this._state.dateTo) {
      this.#datepickerEnd = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          minDate: humanizeEditPointDateTime(this._state.dateFrom),
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate,
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      ...this._state,
      basePrice: Number(evt.target.value),
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate,
    });
  };

  #typeOfTransportChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    this.updateElement(
      EditPointView.parseStateToPoint({
        ...this._state,
        type: evt.target.value,
        offers: [],
      })
    );
  };

  #typeOfOffersChangeHandler = (evt) => {
    const target = evt.target.closest('.event__offer-label');
    if (!target) {
      return;
    }

    const clickedOfferNumber = Number(target.htmlFor.replace(/event-offer-/i, ''));
    let selectedOffers = [...this._state.offers];
    const removeSelectedOffer = (all, number) => all.filter((item) => item !== number);

    if(selectedOffers.includes(clickedOfferNumber)) {
      selectedOffers = removeSelectedOffer(selectedOffers, clickedOfferNumber);
    } else {
      selectedOffers.push(clickedOfferNumber);
    }

    this.updateElement(
      EditPointView.parseStateToPoint({
        ...this._state,
        offers: selectedOffers,
      })
    );
  };

  #typeOfDestinationChangeHandler = (evt) => {
    const TYPE_OF_CITY = this.#destinations.map((city)=> `${city.name}`,'');
    const check = TYPE_OF_CITY.includes(evt.target.value);
    if(!check) {
      const errorButton = this.element.querySelector('.event--error');
      errorButton.textContent = 'Pls select a city from the list';
      errorButton.style.color = 'red';
      errorButton.style.padding = '15px';
      errorButton.style.margin = '0';
      errorButton.style.fontWeight = 'bold';
      return;
    }
    this.updateElement(
      EditPointView.parseStateToPoint({
        ...this._state,
        destination: getDestinationByName(this.#destinations, evt.target.value).id
      })
    );
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset(EditPointView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const isWrongDates = humanizeEditPoint(this._state.dateFrom) > humanizeEditPoint(this._state.dateTo);
    if(isWrongDates) {
      const errorButton = this.element.querySelector('.event--error');
      errorButton.textContent = 'The event\'s end date is invalid (can\'t be earlier than event\'s start date)';
      errorButton.style.color = 'red';
      errorButton.style.padding = '15px';
      errorButton.style.margin = '0';
      errorButton.style.fontWeight = 'bold';
      return;
    }
    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  static parsePointToState = (infoPoint) => ({...infoPoint});

  static parseStateToPoint = (state) => {
    const newState = {...state};
    return newState;
  };
}
