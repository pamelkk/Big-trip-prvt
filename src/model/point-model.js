import { offersByType } from '../mock/offers';
import { destinations } from '../mock/destination';
import { generatePoint } from '../mock/point';
import { TYPE_OF_TRANSPORT } from '../mock/const';
import { sortDate } from '../utils';
import Observable from '../framework/observable';

export default class PointModel extends Observable {
  #points = Array.from({length: 3}, generatePoint).sort(sortDate);
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

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
