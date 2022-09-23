import Observable from '../framework/observable';
import { FilterType } from '../mock/const';

export default class FilterModel extends Observable {
  #currentFilter = FilterType.EVERYTHING;

  get currentFilter () {
    return this.#currentFilter;
  }

  setFilter = (updateType, filter) => {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  };
}
