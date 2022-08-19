import { getRandomElement, getRandomInteger } from '../utils';
import { TYPE_OF_TRANSPORT } from './const';

export const generatePoint = () => ({
  basePrice: 1100,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: getRandomInteger(1, 3),
  id: '0',
  offers: null,
  type: getRandomElement(TYPE_OF_TRANSPORT),
});
