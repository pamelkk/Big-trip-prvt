import { remove, render, RenderPosition } from '../framework/render';
import ListPointsView from '../view/points-list-view';
import AddPointView from '../view/add-point-view';
import NoPointsView from '../view/no-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import { sortPrice, updatePoint, sortTime } from '../utils';
import { SortType } from '../mock/const';

export default class AppPresenter {
  #eventListComponent = new ListPointsView();
  #noPointsComponent = new NoPointsView();
  #sortComponent = null;
  #addPointComponent = null;
  #appContainer = null;
  #pointModel = null;
  #blankPoint = null;
  #infoPoint = [];
  #infoRandomPoint = [];
  #points = [];
  #sourcedPoints = [];
  #offers = [];
  #allTypes = [];
  #allDestinations = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  init = (appContainer, pointModel) => {
    this.#appContainer = appContainer;
    this.#pointModel = pointModel;
    this.#blankPoint = this.#pointModel.blankPoint;
    this.#points = [...this.#pointModel.points];
    this.#sourcedPoints = [...this.#pointModel.points];
    this.#offers = [...this.#pointModel.offersList];
    this.#allTypes = [...this.#pointModel.allTypes];
    this.#allDestinations = [...this.#pointModel.destinations];
    this.#sortComponent = new SortingView();
    this.#infoRandomPoint = {point:this.#blankPoint, allOffers:this.#offers, allTypes:this.#allTypes, allDestinations:this.#allDestinations};
    this.#addPointComponent = new AddPointView(this.#infoRandomPoint);

    this.#renderSort();
    this.#renderListClass();
  };


  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortTime);
        break;
      case SortType.DEFAULT:
        this.#points = [...this.#sourcedPoints];
    }
    this.#currentSortType = sortType;
  };


  #handlePointChange = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#sourcedPoints = updatePoint(this.#sourcedPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.point.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderListClass();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (info) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(info);
    this.#pointPresenter.set(info.point.id, pointPresenter);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#eventListComponent.element);
  };

  #renderListClass = () => {
    render(this.#eventListComponent, this.#appContainer);
    this.#renderPoints();

    const handleClickCreate = () => {
      this.#renderAddPointForm();
    };

    const handleResetFormCreate = () => {
      remove(this.#addPointComponent);
    };

    const handleSubmitFormCreate = (info) => {
      this.#renderPoint(info);
      remove(this.#addPointComponent);
    };

    this.#eventListComponent.setCreateNewPointHandler(handleClickCreate);
    this.#addPointComponent.setResetNewPointFormHandler(handleResetFormCreate);
    this.#addPointComponent.setSubmitNewPointFormHandler(handleSubmitFormCreate);
  };

  #renderAddPointForm = () => {
    render(this.#addPointComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = () => {
    if(this.#points.length === 0) {
      this.#renderNoPoints();
    } else {
      for(const point of this.#points) {
        this.#infoPoint = {point, allOffers:this.#offers, allTypes:this.#allTypes, allDestinations:this.#allDestinations};

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
