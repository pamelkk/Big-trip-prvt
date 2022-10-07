import { remove, render, RenderPosition } from '../framework/render';
import ListPointsView from '../view/list-points-view';
import NoPointsView from '../view/no-points-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import { filter, sortDate, sortPrice, sortTime } from '../utils';
import { FilterType, SortType, UpdateType, UserAction } from '../mock/const';
import NewPointPresenter from './new-point-presenter';
import MainInfoView from '../view/main-info-view';
import LoadingView from '../view/loading-view';
import FilterPresenter from './filter-presenter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class AppPresenter {
  #appContainer = null;
  #mainInfoContainer = null;
  #pointModel = null;
  #filterModel = null;
  #eventListComponent = new ListPointsView();
  #loadingComponent = new LoadingView();
  #noPointsComponent = null;
  #mainInfoComponent = null;
  #tripFiltersElement = null;
  #sortComponent = null;
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #filterPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(appContainer, pointModel, filterModel, mainInfoContainer, tripFiltersElement, addNewButtonElement) {
    this.#appContainer = appContainer;
    this.#mainInfoContainer = mainInfoContainer;
    this.#tripFiltersElement = tripFiltersElement;
    this.addNewButtonElement = addNewButtonElement;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter(this.#eventListComponent.element, this.#handleViewAction);
    this.#filterPresenter = new FilterPresenter(this.#tripFiltersElement, this.#pointModel, this.#filterModel);
  }

  get points() {
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.currentFilter](points);
    const findDisablingFiltersToRemove = (all, value) => all.filter((item) => item !== value);

    const filteredFuturePoints = filter[FilterType.FUTURE](points);
    const filteredPastPoints = filter[FilterType.PAST](points);

    if(!filteredFuturePoints.length) {
      this.#filterPresenter.filtersToDisable.push(FilterType.FUTURE);
    } else {
      this.#filterPresenter.filtersToDisable = findDisablingFiltersToRemove(this.#filterPresenter.filtersToDisable, FilterType.FUTURE);
    }
    if(!filteredPastPoints.length) {
      this.#filterPresenter.filtersToDisable.push(FilterType.PAST);
    } else {
      this.#filterPresenter.filtersToDisable = findDisablingFiltersToRemove(this.#filterPresenter.filtersToDisable, FilterType.PAST);
    }

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.DEFAULT:
        return filteredPoints.sort(sortDate);
    }
    return filteredPoints;
  }

  get currentFilter () {
    return this.#filterModel.currentFilter;
  }

  get offers () {
    return this.#pointModel.offers;
  }

  get destinations () {
    return this.#pointModel.destinations;
  }

  init = () => {
    this.#filterPresenter.init();
    this.#renderListClass();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();

        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.offers, this.destinations);
        if(this.currentFilter !== 'everything') {
          this.#clearPointsList();
          this.#renderListClass();
        }
        remove(this.#mainInfoComponent);
        this.#renderMainInfo();
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderListClass();
        remove(this.#mainInfoComponent);
        this.#renderMainInfo();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList({resetSortType: true});
        this.#renderListClass();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderMainInfo();
        this.#renderListClass();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearPointsList();
        this.#renderNoPoints(FilterType.ERROR);
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderListClass();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (info, offers, destinations) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent.element, this.#handleViewAction, this.#handleModeChange);
    offers = this.offers;
    destinations = this.destinations;
    pointPresenter.init(info, offers, destinations);
    this.#pointPresenter.set(info.id, pointPresenter);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#appContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = (customFilterType) => {
    remove(this.#loadingComponent);
    this.#noPointsComponent = new NoPointsView(customFilterType ?? this.currentFilter);
    render(this.#noPointsComponent, this.#eventListComponent.element);
  };

  #createPoint = (callback, offers, destinations, addNewButtonElement) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    offers = this.offers;
    addNewButtonElement = this.addNewButtonElement;
    destinations = this.destinations;
    this.#newPointPresenter.init(callback, offers, destinations, addNewButtonElement);
  };

  #renderListClass = () => {
    render(this.#eventListComponent, this.#appContainer);
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSort();
    this.#renderPoints(this.points, this.offers, this.destinations);

    if(!this.offers || !this.destinations) {
      this.addNewButtonElement.element.disabled = true;
    }

    if(!this.points.length) {
      this.#renderNoPoints();
      return;
    }

    const handleNewPointFormClose = () => {
      this.addNewButtonElement.element.disabled = false;
    };

    const handleNewPointButtonClick = () => {
      this.#createPoint(handleNewPointFormClose);
      this.addNewButtonElement.element.disabled = true;
    };

    this.addNewButtonElement.setCreateNewPointHandler(handleNewPointButtonClick);
  };

  #renderMainInfo = () => {
    this.#mainInfoComponent = new MainInfoView(this.#pointModel.points, this.destinations);
    render(this.#mainInfoComponent, this.#mainInfoContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (points, offers, destinations) => {
    for(const point of points) {
      this.#renderPoint(point, offers, destinations);
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setChangeSortTypeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#appContainer, RenderPosition.AFTERBEGIN);
  };

  #clearPointsList = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if(this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
