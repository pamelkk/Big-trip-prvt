import { remove, render, RenderPosition } from '../framework/render';
import ListPointsView from '../view/list-points-view';
import NoPointsView from '../view/no-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import { filter, sortDate, sortPrice, sortTime } from '../utils';
import { FilterType, SortType, UpdateType, UserAction } from '../mock/const';
import NewPointPresenter from './new-point-presenter';
import MainInfoView from '../view/main-info-view';
import LoadingView from '../view/loading-view';

export default class AppPresenter {
  #appContainer = null;
  #mainInfoContainer = null;
  #pointModel = null;
  #filterModel = null;
  #eventListComponent = new ListPointsView();
  #loadingComponent = new LoadingView();
  #noPointsComponent = null;
  #mainInfoComponent = null;
  #sortComponent = null;
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  constructor(appContainer, pointModel, filterModel, mainInfoContainer) {
    this.#appContainer = appContainer;
    this.#mainInfoContainer = mainInfoContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter(this.#eventListComponent.element, this.#handleViewAction);
  }

  get points() {
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.currentFilter](points);

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
    this.#renderListClass();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
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
        remove(this.#mainInfoComponent);
        this.#renderMainInfo();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderMainInfo();
        this.#renderListClass();
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

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView(this.currentFilter);
    render(this.#noPointsComponent, this.#eventListComponent.element);
  };

  #createPoint = (callback, offers, destinations) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    offers = this.offers;
    destinations = this.destinations;
    this.#newPointPresenter.init(callback, offers, destinations);
  };

  #renderListClass = () => {
    render(this.#eventListComponent, this.#appContainer);
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const addNewPointButton = document.querySelector('.trip-main__event-add-btn');
    this.#renderSort();
    this.#renderPoints(this.points, this.offers, this.destinations);

    if(!this.offers || !this.destinations) {
      addNewPointButton.disabled = true;
    }

    if(this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    const handleNewPointFormClose = () => {
      addNewPointButton.disabled = false;
    };

    const handleNewPointButtonClick = () => {
      this.#createPoint(handleNewPointFormClose);
      addNewPointButton.disabled = true;
    };

    this.#eventListComponent.setCreateNewPointHandler(handleNewPointButtonClick);
  };

  #renderMainInfo = () => {
    this.#mainInfoComponent = new MainInfoView(this.#pointModel.points, this.destinations, this.offers);
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
