import { offersByType } from '../mock/offers';
import { destinations } from '../mock/destination';
import { generatePoint } from '../mock/point';
import { TYPE_OF_TRANSPORT } from '../mock/const';

export default class PointModel {
  #points = Array.from({length: 0}, generatePoint);
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

  get points() {
    return this.#points;
  }
}
