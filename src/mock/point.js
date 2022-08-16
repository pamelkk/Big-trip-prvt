import { TYPE_OF_TRANSPORT } from '../const';
import { getRandomElement } from '../utils';

export const generatePoint = () => ({
  basePrice: 1100,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: 1,
  id: '0',
  offers: [1, 2],
  type: getRandomElement(TYPE_OF_TRANSPORT),
});
