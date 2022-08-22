import { humanizePointDate, humanizePointTime } from '../utils';
import GetRemoveElement from './getOrRemoveElements-view';

const createEventTemplate = (point, destination, selectedOffers) => {
  const { type, dateFrom, dateTo, basePrice } = point;
  const {name} = destination;

  const offers = selectedOffers.offers.reduce((prev, current) => `
  ${prev}
  <li class='event__offer'>
    <span class='event__offer-title'>${current.title}</span>
    &plus;&euro;&nbsp;
    <span class='event__offer-price'>${current.price}</span>
  </li>`, '');

  const dateStart = dateFrom ? humanizePointDate(dateFrom) : '';
  const timeFrom = dateFrom ? humanizePointTime(dateFrom) : '';
  const timeTo = dateTo ? humanizePointTime(dateTo) : '';

  return `<li class='trip-events__item'>
    <div class='event'>
      <time class='event__date' datetime='2019-03-18'>${dateStart}</time>
      <div class='event__type'>
        <img class='event__type-icon' width='42' height='42' src='img/icons/${type}.png' alt='Event type icon'>
      </div>
      <h3 class='event__title'>${type} ${name}</h3>
      <div class='event__schedule'>
        <p class='event__time'>
          <time class='event__start-time' datetime='2019-03-18T10:30'>${timeFrom}</time>
          &mdash;
          <time class='event__end-time' datetime='2019-03-18T11:00'>${timeTo}</time>
        </p>
      </div>
      <p class='event__price'>
        &euro;&nbsp;<span class='event__price-value'>${basePrice}</span>
      </p>
      <h4 class='visually-hidden'>Offers:</h4>
      <ul class='event__selected-offers'>
        ${offers}
      </ul>
      <button class='event__rollup-btn' type='button'>
        <span class='visually-hidden'>Open event</span>
      </button>
    </div>
  </li>`;
};

export default class PointView extends GetRemoveElement {
  constructor(point, destination, selectedOffers) {
    super();
    this.point = point;
    this.destination = destination;
    this.selectedOffers = selectedOffers;
  }

  getTemplate() {
    return createEventTemplate(this.point, this.destination, this.selectedOffers);
  }
}
