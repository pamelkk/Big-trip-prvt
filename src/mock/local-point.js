import { TYPE_OF_TRANSPORT } from '../const';
import { getRandomElement } from '../utils';
import { offer } from './offer';

export const generateLocalPoint = () => ({
  basePrice: 222,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: [1],
  offers: getRandomElement(offer),
  type: getRandomElement(TYPE_OF_TRANSPORT)
});
