import { CITIES } from '../const';
import { getRandomElement } from '../utils';

export const generateDestination = () => ({
  id: 1,
  description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
  name: getRandomElement(CITIES),
  pictures: [
    {
      src: 'http://picsum.photos/300/200?r=0.0762563005163317',
      description: 'Chamonix parliament building'
    }
  ]
});
