import { remove, render, RenderPosition } from '../framework/render';
import ListPointsView from '../view/list-points-view';
import NoPointsView from '../view/no-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import { filter, sortDate, sortPrice, sortTime } from '../utils';
import { FilterType, SortType, UpdateType, UserAction } from '../mock/const';
import NewPointPresenter from './new-point-presenter';

export default class AppPresenter {
  #appContainer = null;
  #pointModel = null;
  #filterModel = null;
  #eventListComponent = new ListPointsView();
  #noPointsComponent = null;
  #sortComponent = null;
  #infoPoint = [];
  #infoRandomPoint = [];
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;

  constructor(appContainer, pointModel, filterModel) {
    this.#appContainer = appContainer;
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

  get blankPoint () {
    return this.#pointModel.blankPoint;
  }

  get currentFilter () {
    return this.#filterModel.currentFilter;
  }

  get allTypes () {
    return this.#pointModel.allTypes;
  }

  get offers () {
    return this.#pointModel.offersList;
  }

  get allDestinations () {
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
        this.#pointPresenter.get(data.point.id).init(data);
        if(this.currentFilter !== 'everything') {
          this.#clearPointsList();
          this.#renderListClass();
        }
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderListClass();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList({resetSortType: true});
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

  #renderPoint = (info) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(info);
    this.#pointPresenter.set(info.point.id, pointPresenter);
  };

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView(this.currentFilter);
    render(this.#noPointsComponent, this.#eventListComponent.element);
  };

  #createPoint = (callback, info) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(callback, info);
  };

  #renderListClass = () => {
    const addNewPointButton = document.querySelector('.trip-main__event-add-btn');

    render(this.#eventListComponent, this.#appContainer);
    this.#renderSort();
    const points = this.points;
    this.#renderPoints(points);

    this.#infoRandomPoint = {
      point:this.blankPoint,
      allOffers:this.offers,
      allTypes:this.allTypes,
      allDestinations:this.allDestinations
    };

    if(points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    const handleNewPointFormClose = () => {
      addNewPointButton.disabled = false;
    };

    const handleNewTaskButtonClick = () => {
      this.#createPoint(handleNewPointFormClose, this.#infoRandomPoint);
      addNewPointButton.disabled = true;
    };

    this.#eventListComponent.setCreateNewPointHandler(handleNewTaskButtonClick);
  };

  #renderPoints = (points) => {
    for(const point of points) {
      this.#infoPoint = {
        point,
        allOffers:this.offers,
        allTypes:this.allTypes,
        allDestinations:this.allDestinations
      };

      this.#renderPoint(this.#infoPoint);
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

    if(this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
