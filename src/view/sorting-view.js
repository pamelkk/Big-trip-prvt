import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../mock/const';

const createSortingTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--${SortType.DEFAULT}">
  <input id="sort-${SortType.DEFAULT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${currentSortType === SortType.DEFAULT ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${SortType.DEFAULT}" data-sort-type="${SortType.DEFAULT}">${SortType.DEFAULT}</label>
</div>

<div class="trip-sort__item  trip-sort__item--${SortType.EVENT}">
  <input id="sort-${SortType.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.EVENT}" disabled>
  <label class="trip-sort__btn" for="sort-${SortType.EVENT}" data-sort-type="${SortType.EVENT}">${SortType.EVENT}</label>
</div>

<div class="trip-sort__item  trip-sort__item--${SortType.TIME}">
  <input id="sort-${SortType.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.TIME}" ${currentSortType === SortType.TIME ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${SortType.TIME}" data-sort-type="${SortType.TIME}">${SortType.TIME}</label>
</div>

<div class="trip-sort__item  trip-sort__item--${SortType.PRICE}">
  <input id="sort-${SortType.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.PRICE}" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${SortType.PRICE}" data-sort-type="${SortType.PRICE}">${SortType.PRICE}</label>
</div>

<div class="trip-sort__item  trip-sort__item--${SortType.OFFERS}">
  <input id="sort-${SortType.OFFERS}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.OFFERS}" disabled>
  <label class="trip-sort__btn" for="sort-${SortType.OFFERS}" data-sort-type="${SortType.OFFERS}">${SortType.OFFERS}</label>
</div>
</form>`
);

export default class SortingView extends AbstractView {
  #currentSortType = null;

  constructor (currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  setChangeSortTypeHandler = (callback) => {
    this._callback.changeSort = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'LABEL') {
      return;
    }

    evt.preventDefault();
    this._callback.changeSort(evt.target.dataset.sortType);
  };
}
