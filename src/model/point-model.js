import { offersByType } from '../mock/offers';
import { destinations } from '../mock/destination';
import { generatePoint } from '../mock/point';

export default class PointModel {
  points = Array.from({length: 3}, generatePoint);
  offersList = offersByType;
  destinations = destinations;

  getOffers = () => this.offersList;
  getDestinations = () => this.destinations;
  getPoints = () => this.points;
}
