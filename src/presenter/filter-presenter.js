import { remove, render, replace } from '../framework/render';
import { UpdateType } from '../mock/const';
import FiltersView from '../view/filters-view';

export default class FilterPresenter {
  #filterModel = null;
  #pointModel = null;
  #filterContainer = null;
  #filterComponent = null;

  constructor (filterContainer, pointModel, filterModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get currentFilter() {
    return this.#filterModel.currentFilter;
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(this.#filterModel.currentFilter);
    this.#filterComponent.setFilterChangeHandler(this.#handleFilterTypeChange);

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.currentFilter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
