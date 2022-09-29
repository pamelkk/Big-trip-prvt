import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../mock/const';

const createFiltersTemplate = (filterType) => (
  `<form class="trip-filters" action="#" method="get">
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.EVERYTHING}" ${filterType === FilterType.EVERYTHING ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${FilterType.EVERYTHING}">${FilterType.EVERYTHING}</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.FUTURE}" ${filterType === FilterType.FUTURE ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${FilterType.FUTURE}">${FilterType.FUTURE}</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.PAST}" ${filterType === FilterType.PAST ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${FilterType.PAST}">${FilterType.PAST}</label>
  </div>

  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #currentFilter = null;

  constructor (currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFiltersTemplate(this.#currentFilter);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.changeFilter = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.changeFilter(evt.target.value);
  };
}
