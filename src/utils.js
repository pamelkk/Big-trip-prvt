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
  if (pointA.basePrice > pointB.basePrice) {
    return 1;
  } else if (pointB.basePrice > pointA.basePrice) {
    return -1;
  } else {
    return 0;
  }
};

const getDestination = (all, point) => all.find((item) => item.id === point.destination);
const getMatchedOffers = (all, point) => all.find((item) => item.type === point.type);
const getSelectedOffers = (all, point) => all.filter((item) => point.find((offerId) => offerId === item.id));
const getNotSelectedOffers = (all, select) => all.filter((item) => select.every((offer) => offer.title !== item.title));

const getArray = (elements) => [...new Set(elements)].slice(0, getRandomInteger(0, 2));

export {getRandomElement, humanizePointDate, humanizePointTime, getRandomInteger, getArray, updatePoint, getDestination, getMatchedOffers, getSelectedOffers, getNotSelectedOffers, sortPrice};

