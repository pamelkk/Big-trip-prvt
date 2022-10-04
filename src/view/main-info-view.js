import AbstractView from '../framework/view/abstract-view';
import { humanizePointDate } from '../utils';

const createMainInfoTemplate = (points, destinations) => {
  const firstDateElement = points || !points.length ? points[0] : '';
  const lastDateElement = points || !points.length ? points[points.length - 1] : '';
  const firstDate = firstDateElement ? humanizePointDate(firstDateElement.dateFrom) : '';
  const lastDate = lastDateElement ? humanizePointDate(lastDateElement.dateFrom) : '';
  const getCityofElement = (all, value) => all.find((item) => value === item.id);
  const getMatchedCities = (all, values) => all.filter((item) => values.find((value) => value.destination === item.id));
  const matchedCities = getMatchedCities(destinations, points);
  const citiesForRoute = matchedCities.map((city)=> `${city.name}`);
  let dates = '';
  let way = '';

  if(firstDateElement) {
    dates = `${firstDate}${firstDateElement === lastDateElement ? '' : `&nbsp;&mdash;&nbsp;${lastDate}`}`;
  } else {
    dates = 'No dates :(';
  }

  if(points.length === 0) {
    way = 'No route :(';
  } else {
    if(points.length > 3) {
      const firstCityElement = points || !points.length ? getCityofElement(destinations, points[0].destination) : '';
      const lastCityElement = points || !points.length ? getCityofElement(destinations, points[points.length - 1].destination) : '';
      const firstCity = firstCityElement ? firstCityElement.name : '';
      const lastCity = lastCityElement ? lastCityElement.name : '';
      way = `${firstCity}&nbsp;&mdash;&hellip;&mdash;&nbsp;${lastCity}`;
    } else {
      way = citiesForRoute.join('&nbsp;&mdash;&nbsp;');
    }
  }

  const total = points.reduce((p,c)=> Number(p) + Number(c.basePrice),'');

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${way}</h1>

    <p class="trip-info__dates">${dates}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>
</section>`;
};

export default class MainInfoView extends AbstractView {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createMainInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
