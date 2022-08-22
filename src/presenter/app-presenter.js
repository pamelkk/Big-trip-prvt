import { render } from '../render';
import ListPointsView from '../view/points-list-view';
import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import AddPointView from '../view/add-point-view';
import OfferToAddPointView from '../view/offerToAddPoint-view';

export default class AppPresenter {
  #eventListComponent = new ListPointsView();
  #addEventComponent = new AddPointView();
  #offerToAddPointComponent = new OfferToAddPointView();
  #appContainer = null;
  #pointModel = null;
  #points = [];
  #offers = [];
  #allTypes = [];
  #destinations = [];

  #renderPoint = (points, destinations, offers, allTypesOfTransport) => {
    const pointComponent = new PointView(points, destinations, offers, allTypesOfTransport);
    const editPointComponent = new EditPointView(points, destinations, offers, allTypesOfTransport);

    const replacePointToEditPoint = () => {
      this.#eventListComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const replaceEditPointToPoint = () => {
      this.#eventListComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEditPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditPointToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#eventListComponent.element);
  };

  init = (appContainer, pointModel) => {
    this.#appContainer = appContainer;
    this.#pointModel = pointModel;
    this.#points = [...this.#pointModel.points];
    this.#offers = [...this.#pointModel.offersList];
    this.#allTypes = [...this.#pointModel.allTypes];
    this.#destinations = [...this.#pointModel.destinations];

    render(this.#eventListComponent, this.#appContainer);
    render(this.#addEventComponent, this.#eventListComponent.element);

    if(this.#points.length === 0) {
      render(this.#offerToAddPointComponent, this.#eventListComponent.element);
    } else {
      for(let i = 0; i < this.#points.length; i++) {
        const destination = this.#destinations.find((item) => item.id === this.#points[i].destination);
        const selectedOffers = this.#offers.find((item) => item.type === this.#points[i].type);
        this.#points[i].offers = selectedOffers;

        this.#renderPoint(this.#points[i], destination, selectedOffers, this.#allTypes);
      }
    }
  };
}
