import { offersByType } from '../mock/offers';
import { destinations } from '../mock/destination';
import { generatePoint } from '../mock/point';
import { TYPE_OF_TRANSPORT } from '../mock/const';
import { sortDate } from '../utils';

export default class PointModel {
  #points = Array.from({length: 1}, generatePoint).sort(sortDate);
  #blankPoint = generatePoint();
  #offersList = offersByType;
  #destinations = destinations;
  #allTypes = TYPE_OF_TRANSPORT;

  get offersList() {
    return this.#offersList;
  }

  get allTypes() {
    return this.#allTypes;
  }

  get destinations() {
    return this.#destinations;
  }

  get blankPoint() {
    return this.#blankPoint;
  }

  get points() {
    return this.#points;
  }
}
