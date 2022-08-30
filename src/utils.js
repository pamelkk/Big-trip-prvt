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

const getArray = (elements) => [...new Set(elements)].slice(0, getRandomInteger(0, 2));

export {getRandomElement, humanizePointDate, humanizePointTime, getRandomInteger, getArray, updatePoint};

