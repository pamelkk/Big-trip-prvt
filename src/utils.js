import dayjs from 'dayjs';

// Рандомное число
const getRandomElement = (elements) => {
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  return randomElement;
};

const humanizePointDate = (date) => dayjs(date).format('MMM D');
const humanizePointTime = (time) => dayjs(time).format('HH:MM');


const randomInteger = (min, max) => {
  const randElement = min + Math.random() * (max + 1 - min);
  return Math.floor(randElement);
};

const getArray = (elements) => {
  const maxLength = elements.length;
  const lengthOfArray = randomInteger(1, maxLength);
  const array = [];

  while (array.length < lengthOfArray) {
    const indexOfEl = randomInteger(0, maxLength - 1);
    const el = elements[indexOfEl];

    if (!array.includes(el)) {
      array.push(el);
    }
  }
  return array;
};


export {getRandomElement, humanizePointDate, humanizePointTime, randomInteger, getArray};

