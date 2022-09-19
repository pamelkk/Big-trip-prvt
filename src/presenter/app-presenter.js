import { remove, render, RenderPosition } from '../framework/render';
import ListPointsView from '../view/points-list-view';
import AddPointView from '../view/add-point-view';
import NoPointsView from '../view/no-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import { sortPrice, updatePoint, sortTime } from '../utils';
import { SortType, UpdateType, UserAction } from '../mock/const';

export default class AppPresenter {
  #appContainer = null;
  #pointModel = null;
  #eventListComponent = new ListPointsView();
  #noPointsComponent = new NoPointsView();
  #sortComponent = new SortingView();
  #addPointComponent = null;
  #blankPoint = null;
  #infoPoint = [];
  #infoRandomPoint = [];
  #offers = [];
  #allTypes = [];
  #allDestinations = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(appContainer, pointModel) {
    this.#appContainer = appContainer;
    this.#pointModel = pointModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [this.#pointModel.points].sort(sortPrice);
      case SortType.TIME:
        return [this.#pointModel.points].sort(sortTime);
    }
    return this.#pointModel.points;
  }

  init = () => {
    this.#blankPoint = this.#pointModel.blankPoint;
    this.#offers = [...this.#pointModel.offersList];
    this.#allTypes = [...this.#pointModel.allTypes];
    this.#allDestinations = [...this.#pointModel.destinations];
    this.#infoRandomPoint = {
      point:this.#blankPoint,
      allOffers:this.#offers,
      allTypes:this.#allTypes,
      allDestinations:this.#allDestinations
    };
    this.#addPointComponent = new AddPointView(this.#infoRandomPoint);

    this.#renderSort();
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
        break;
      case UpdateType.MINOR:
        this.#pointModel.deletePoint(updateType, data);
        break;
      case UpdateType.MAJOR:
        this.#pointModel.addPoint(updateType, data);
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
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (info) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(info);
    this.#pointPresenter.set(info.point.id, pointPresenter);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#eventListComponent.element);
  };

  #renderListClass = () => {
    render(this.#eventListComponent, this.#appContainer);
    this.#renderPoints();

    const onEscKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        remove(this.#addPointComponent);
      }
    };

    const handleClickCreate = () => {
      this.#renderAddPointForm();
      document.addEventListener('keydown', onEscKeyDownHandler);
    };

    const handleResetFormCreate = () => {
      remove(this.#addPointComponent);
      document.removeEventListener('keydown', onEscKeyDownHandler);
    };

    const handleSubmitFormCreate = (info) => {
      this.#renderPoint(info);
      remove(this.#addPointComponent);
      document.removeEventListener('keydown', onEscKeyDownHandler);
    };

    this.#eventListComponent.setCreateNewPointHandler(handleClickCreate);
    this.#addPointComponent.setResetNewPointFormHandler(handleResetFormCreate);
    this.#addPointComponent.setSubmitNewPointFormHandler(handleSubmitFormCreate);
  };

  #renderAddPointForm = () => {
    render(this.#addPointComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = () => {
    if(this.points.length === 0) {
      this.#renderNoPoints();
    } else {
      for(const point of this.points) {
        this.#infoPoint = {
          point,
          allOffers:this.#offers,
          allTypes:this.#allTypes,
          allDestinations:this.#allDestinations
        };

        this.#renderPoint(this.#infoPoint);
      }
    }
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#appContainer);

    this.#sortComponent.setChangeSortTypeHandler(this.#handleSortTypeChange);
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
