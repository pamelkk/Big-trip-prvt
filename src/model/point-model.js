import { TYPE_OF_TRANSPORT, UpdateType } from '../mock/const';
import { getRandomElement, sortDate } from '../utils';
import Observable from '../framework/observable';

export default class PointModel extends Observable {
  #points = [];
  #blankPoint = null;
  #offers = [];
  #destinations = [];
  #allTypes = TYPE_OF_TRANSPORT;
  #pointsApiService = null;
  #destinationsApiService = null;
  #offersApiService = null;

  constructor (pointsApiService, destinationsApiService, offersApiService) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#destinationsApiService = destinationsApiService;
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
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

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      const destinations = await this.#destinationsApiService.destinations;
      const offers = await this.#offersApiService.offers;
      this.#points = points.map(this.#adaptToClient).sort(sortDate);
      this.#blankPoint = getRandomElement(this.#points);
      this.#destinations = destinations;
      this.#offers = offers;
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#blankPoint = null;
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.point.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = (updateType, update) => {
    this.#points = [
      ...this.#points, update.point
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.point.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
