import dayjs from 'dayjs';

// Рандомное число
const getRandomElement = (elements) => {
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  return randomElement;
};

const humanizePointDate = (date) => dayjs(date).format('MMM D');
const humanizePointTime = (time) => dayjs(time).format('HH:MM');

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
  if (dayjs(pointB.dateFrom).diff(dayjs(pointB.dateTo)) > dayjs(pointA.dateFrom).diff(dayjs(pointA.dateTo))) {
    return 1;
  } else if (dayjs(pointA.dateFrom).diff(dayjs(pointA.dateTo)) > dayjs(pointB.dateFrom).diff(dayjs(pointB.dateTo))) {
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

const getDestinationById = (all, point) => all.find((item) => item.id === point);
const getDestinationByName = (all, value) => all.find((item) => item.name === value);
const getMatchedOffersByType = (all, point) => all.find((item) => item.type === point);
const getMatchedOffersByName = (all, values) => all.filter((item) => values.find((name) => name === item.title));
const getSelectedOffers = (all, point) => all.filter((item) => point.find((offerId) => offerId === item.id));
const getNotSelectedOffers = (all, select) => all.filter((item) => select.every((offer) => offer.title !== item.title));
const getNotSelectedTypes = (all, point) => all.filter((item) => item !== point);

const getArray = (elements) => [...new Set(elements)].slice(0, getRandomInteger(0, 2));

export {getRandomElement, humanizePointDate, humanizePointTime, getRandomInteger, getArray, updatePoint, getDestinationById, getDestinationByName, getMatchedOffersByType, getMatchedOffersByName, getSelectedOffers, getNotSelectedOffers, sortPrice, sortDate, sortTime, getNotSelectedTypes};

