import { generateOffer } from '../mock/offers-by-type';

export default class OfferModel {
  offersList = Array.from({length: 1}, generateOffer);

  getOffers = () => this.offersList;
}
