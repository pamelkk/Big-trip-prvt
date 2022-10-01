import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDestinationById, getMatchedOffersByType, getSelectedOffers, humanizePointDate, humanizePointTime } from '../utils';

const createEventTemplate = (point, allOffers, allDestinations) => {
  const { type, dateFrom, dateTo, basePrice, isFavorite } = point;

  const bestPoint = isFavorite ? 'event__favorite-btn--active' : '';

  const matchedOffers = getMatchedOffersByType(allOffers, point);
  const selectedOffers = getSelectedOffers(matchedOffers.offers, point.offers);
  const destination = getDestinationById(allDestinations, point);

  const offersList = selectedOffers.reduce((prev, current) => `
  ${prev}
  <li class='event__offer'>
    <span class='event__offer-title'>${current.title}</span>
    &plus;&euro;&nbsp;
    <span class='event__offer-price'>${current.price}</span>
  </li>`, '');

  const dateStart = dateFrom ? humanizePointDate(dateFrom) : '';
  const timeFrom = dateFrom ? humanizePointTime(dateFrom) : '';
  const timeTo = dateTo ? humanizePointTime(dateTo) : '';
  const timeduration = dateFrom && dateTo ? dayjs(dateTo).diff(dateFrom,'minute', true) : '??';

  let timeDuration = '';

  if(timeduration) {
    if(timeduration <= 59) {
      timeDuration = `${Math.trunc(timeduration)}M`;
    }
    if(timeduration >= 60 && timeduration < 1439) {
      const hours = Math.trunc(timeduration / 60);
      const minutes = Math.trunc(timeduration % 60);

      timeDuration = `${hours}H ${minutes}M`;
    }
    if(timeduration >= 1440) {
      const days = Math.trunc(timeduration / 1440);
      const hours = Math.trunc(days % 1440);
      const minutes = Math.trunc(hours % 60);

      timeDuration = `${days}D ${hours}H ${minutes}M`;
    }
  } else {
    timeDuration = 'Ooops...Can\'t count :c';
  }

  return `<li class='trip-events__item'>
    <div class='event'>
      <time class='event__date' datetime='2019-03-18'>${dateStart}</time>
      <div class='event__type'>
        <img class='event__type-icon' width='42' height='42' src='img/icons/${type}.png' alt='Event type icon'>
      </div>
      <h3 class='event__title'>${type} ${destination.name}</h3>
      <div class='event__schedule'>
        <p class='event__time'>
          <time class='event__start-time' datetime='2019-03-18T10:30'>${timeFrom}</time>
          &mdash;
          <time class='event__end-time' datetime='2019-03-18T11:00'>${timeTo}</time>
        </p>
        <p class="event__duration">${timeDuration}</p>
      </div>
      <p class='event__price'>
        &euro;&nbsp;<span class='event__price-value'>${basePrice}</span>
      </p>
      <h4 class='visually-hidden'>Offers:</h4>
      <ul class='event__selected-offers'>
      ${offersList}
      </ul>
      <button class="event__favorite-btn ${bestPoint}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
      <button class='event__rollup-btn' type='button'>
        <span class='visually-hidden'>Open event</span>
      </button>
    </div>
  </li>`;
};

export default class PointView extends AbstractStatefulView {
  #infoPoint = [];
  #offers = [];
  #destinations = [];

  constructor(infoPoint, offers, destinations) {
    super();
    this.#infoPoint = infoPoint;
    this.#offers = offers;
    this.#destinations = destinations;
    this._state = PointView.parsePointToState(infoPoint);
    this.#setInnerHandlers();
  }

  get template() {
    return createEventTemplate(this._state, this.#offers, this.#destinations);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#addRemoveFavoriteChangeHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #addRemoveFavoriteChangeHandler = () => {
    let result = null;

    if(this._state.isFavorite) {
      result = false;
    } else {
      result = true;
    }

    this.updateElement(
      PointView.parseStateToPoint({
        ...this._state,
        isFavorite: result
      })
    );
  };

  setEditClickHandler = (callback) => {
    this._callback.click = callback;
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  static parsePointToState = (infoPoint) => ({...infoPoint});

  static parseStateToPoint = (state) => {
    const newState = {...state};

    return newState;
  };
}
