import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { FilterType } from './mock/const';
dayjs.extend(isSameOrAfter);

const getRandomElement = (elements) => {
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  return randomElement;
};

const isEscPressed = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const humanizePointDate = (date) => dayjs(date).format('MMM D');
const humanizePointTime = (time) => dayjs(time).format('HH:mm');
const humanizeEditPointDateTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');
const humanizeEditPoint = (date) => dayjs(date).format('DD/MM/YY');

const getRandomInteger = (min, max) => {
  const randElement = min + Math.random() * (max + 1 - min);
  return Math.floor(randElement);
};

const updatePoint = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortPrice = (pointA, pointB) => {
  if (pointB.basePrice > pointA.basePrice) {
    return 1;
  } else if (pointA.basePrice > pointB.basePrice) {
    return -1;
  } else {
    return 0;
  }
};

const sortTime = (pointA, pointB) => {
  if (dayjs(pointA.dateFrom).diff(dayjs(pointA.dateTo)) > dayjs(pointB.dateFrom).diff(dayjs(pointB.dateTo))) {
    return 1;
  } else if (dayjs(pointB.dateFrom).diff(dayjs(pointB.dateTo)) > dayjs(pointA.dateFrom).diff(dayjs(pointA.dateTo))) {
    return -1;
  } else {
    return 0;
  }
};

const sortDate = (pointA, pointB) => {
  if (pointA.dateFrom > pointB.dateFrom) {
    return 1;
  } else if (pointB.dateFrom > pointA.dateFrom) {
    return -1;
  } else {
    return 0;
  }
};

const getDestinationById = (all, point) => all.find((item) => item.id === point.destination);
const getDestinationByName = (all, value) => all.find((item) => item.name === value);
const getMatchedOffersByType = (all, point) => all.find((item) => item.type === point.type);
const getMatchedOffersByName = (all, values) => all.filter((item) => values.find((name) => name === item.title));
const getSelectedOffers = (all, point) => all.filter((item) => point.find((offerId) => offerId === item.id));
const getNotSelectedOffers = (all, select) => all.filter((item) => select.every((offer) => offer.title !== item.title));
const getNotSelectedTypes = (all, point) => all.filter((item) => item !== point);

const getArray = (elements) => [...new Set(elements)].slice(0, getRandomInteger(0, 2));

const getPointSameOrAfterToday = (point) => point.dateFrom >= dayjs(new Date());
const getPointLongerToday = (point) => point.dateTo > dayjs(new Date());
const getPointEndEarlierToday = (point) => dayjs(new Date()) > point.dateTo;

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => getPointSameOrAfterToday(point) || getPointLongerToday(point)),
  [FilterType.PAST]: (points) => points.filter((point) => getPointEndEarlierToday(point)),
};

export {isEscPressed, getRandomElement, filter, humanizeEditPoint, humanizeEditPointDateTime, humanizePointDate, humanizePointTime, getRandomInteger, getArray, updatePoint, getDestinationById, getDestinationByName, getMatchedOffersByType, getMatchedOffersByName, getSelectedOffers, getNotSelectedOffers, sortPrice, sortDate, sortTime, getNotSelectedTypes};

