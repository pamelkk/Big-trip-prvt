import { nanoid } from 'nanoid';
import { getArray, getRandomElement, getRandomInteger } from '../utils';
import { TYPE_OF_TRANSPORT } from './const';

export const generatePoint = () => ({
  basePrice: getRandomInteger(100, 2000),
  dateFrom: '2019-07-11T22:55:56.845Z',
  dateTo: '2019-07-16T11:22:13.375Z',
  destination: getRandomInteger(1, 3),
  id: nanoid(),
  offers: getArray([1, 5]),
  type: getRandomElement(TYPE_OF_TRANSPORT),
});
