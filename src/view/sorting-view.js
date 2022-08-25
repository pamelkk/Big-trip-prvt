import AbstractView from '../framework/view/abstract-view';

const createSortingTemplate = (sortings) => {

  const sorts = sortings.reduce((prev, current) => `
  ${prev}
  <div class="trip-sort__item  trip-sort__item--${current}">
  <input id="sort-${current}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${current}">
  <label class="trip-sort__btn" for="sort-${current}">${current}</label>
  </div>`, '');

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${sorts}
</form>`;
};

export default class SortingView extends AbstractView {
  #sortings = [];

  constructor(sortings) {
    super();
    this.#sortings = sortings;
  }

  get template() {
    return createSortingTemplate(this.#sortings);
  }
}
