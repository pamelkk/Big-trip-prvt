import { generateDestination } from '../mock/destination';
import { generateOffersByType } from '../mock/offers-by-type';
import { generatePoint } from '../mock/point';

export default class PointModel {
  points = Array.from({length: 3}, generatePoint);
  offers = Array.from({length: 1}, generateOffersByType);
  destinations = Array.from({length: 1}, generateDestination);

  getOffers = () => this.offers;
  getDestinations = () => this.destinations;
  getPoints = () => this.points;
}
