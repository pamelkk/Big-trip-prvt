import { TYPE_OF_TRANSPORT } from '../const';
import { getArray, getRandomElement } from '../utils';
import { offers } from './offer';

export const generateOffersByType = () => ({
  type: getRandomElement(TYPE_OF_TRANSPORT),
  offers: getArray(offers)
});
