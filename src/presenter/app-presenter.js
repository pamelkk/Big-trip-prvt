import { render } from '../framework/render';
import ListPointsView from '../view/points-list-view';
import AddPointView from '../view/add-point-view';
import NoPointsView from '../view/no-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';

export default class AppPresenter {
  #eventListComponent = new ListPointsView();
  #noPointsComponent = new NoPointsView();
  #appContainer = null;
  #pointModel = null;
  #blankPoint = null;
  #points = [];
  #offers = [];
  #allTypes = [];
  #allDestinations = [];
  #allSortings = [];

  #renderPoint = (info) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent.element);
    pointPresenter.init(info);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#eventListComponent.element);
  };

  #renderListClass = () => {
    render(this.#eventListComponent, this.#appContainer);
    this.#renderAddPointForm();
    this.#renderPoints();
  };

  #renderAddPointForm = () => {
    const destinationForAdd = this.#allDestinations.find((item) => item.id === this.#blankPoint.destination);
    const allOffersForAdd = this.#offers.find((item) => item.type === this.#blankPoint.type);
    const selectedOffersForAdd = allOffersForAdd.offers.filter((item) => this.#blankPoint.offers.find((offerId) => offerId === item.id));
    let filteredOffersForAdd = allOffersForAdd.offers.filter((item) => selectedOffersForAdd.every((offer) => offer.title !== item.title));
    this.#blankPoint.offers = selectedOffersForAdd;
    this.#blankPoint.destination = destinationForAdd;

    if(selectedOffersForAdd.length === 0) {
      filteredOffersForAdd = allOffersForAdd.offers;
    }

    const infoRandomPoint = [this.#blankPoint, filteredOffersForAdd, this.#allTypes, this.#allDestinations];

    render(new AddPointView(infoRandomPoint), this.#eventListComponent.element);
  };

  #renderPoints = () => {
    if(this.#points.length === 0) {
      this.#renderNoPoints();
    } else {
      for(const point of this.#points) {
        const destination = this.#allDestinations.find((item) => item.id === point.destination);
        const allOffers = this.#offers.find((item) => item.type === point.type);
        const selectedOffers = allOffers.offers.filter((item) => point.offers.find((offerId) => offerId === item.id));
        let filteredOffers = allOffers.offers.filter((item) => selectedOffers.every((offer) => offer.title !== item.title));
        point.offers = selectedOffers;
        point.destination = destination;

        if(selectedOffers.length === 0) {
          filteredOffers = allOffers.offers;
        }

        const infoPoint = [point, filteredOffers, this.#allTypes];

        this.#renderPoint(infoPoint);
      }
    }
  };

  #renderSort = () => {
    render(new SortingView(this.#allSortings), this.#appContainer);
  };

  init = (appContainer, pointModel) => {
    this.#appContainer = appContainer;
    this.#pointModel = pointModel;
    this.#blankPoint = this.#pointModel.blankPoint;
    this.#points = [...this.#pointModel.points];
    this.#offers = [...this.#pointModel.offersList];
    this.#allTypes = [...this.#pointModel.allTypes];
    this.#allDestinations = [...this.#pointModel.destinations];
    this.#allSortings = [...this.#pointModel.allSortings];

    this.#renderSort();
    this.#renderListClass();
  };
}
