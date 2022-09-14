import { nanoid } from 'nanoid';
import { getArray, getRandomElement, getRandomInteger } from '../utils';
import { TYPE_OF_TRANSPORT } from './const';

export const generatePoint = () => ({
  basePrice: getRandomInteger(100, 2000),
  dateFrom: `2022-0${ getRandomInteger(1, 9) }-${ getRandomInteger(10, 31) }T${ getRandomInteger(0, 23) }:${ getRandomInteger(0, 59) }.845`,
  dateTo: `2022-0${ getRandomInteger(1, 9) }-${ getRandomInteger(10, 31) }T${ getRandomInteger(0, 23) }:${ getRandomInteger(0, 59) }.375`,
  destination: getRandomInteger(1, 3),
  id: nanoid(),
  offers: getArray([1, 5]),
  type: getRandomElement(TYPE_OF_TRANSPORT),
});
