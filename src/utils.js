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

const getArray = (elements) => [...new Set(elements)].slice(0, getRandomInteger(0, 2));

export {getRandomElement, humanizePointDate, humanizePointTime, getRandomInteger, getArray};

