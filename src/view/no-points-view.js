import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsTextType } from '../mock/const.js';

const createNoPointsTemplate = (filterType) => {
  const noPointsTextValue = NoPointsTextType[filterType];

  return (`<p class="trip-events__msg">${noPointsTextValue}</p>`);
};

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor (filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
