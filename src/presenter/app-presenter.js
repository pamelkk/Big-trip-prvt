import { render, replace } from '../framework/render';
import ListPointsView from '../view/points-list-view';
import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import AddPointView from '../view/add-point-view';
import NoPointsView from '../view/no-points-view';

export default class AppPresenter {
  #eventListComponent = new ListPointsView();
  #offerToAddPointComponent = new NoPointsView();
  #appContainer = null;
  #pointModel = null;
  #points = [];
  #offers = [];
  #allTypes = [];
  #destinations = [];

  #renderPoint = (info) => {
    const pointComponent = new PointView(info);
    const editPointComponent = new EditPointView(info);

    const replacePointToEditPoint = () => {
      replace(editPointComponent, pointComponent);
    };

    const replaceEditPointToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToEditPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.setFormSubmitHandler(() => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.setFormClickHandler(() => {
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
    render(new AddPointView(this.#destinations, this.#allTypes), this.#eventListComponent.element);

    if(this.#points.length === 0) {
      render(this.#offerToAddPointComponent, this.#eventListComponent.element);
    } else {
      for(let i = 0; i < this.#points.length; i++) {
        const destination = this.#destinations.find((item) => item.id === this.#points[i].destination);
        const matchedOffers = this.#offers.find((item) => item.type === this.#points[i].type);
        this.#points[i].offers = matchedOffers;

        const infoPoint = [this.#points[i], destination, matchedOffers, this.#allTypes];

        this.#renderPoint(infoPoint);
      }
    }
  };
}
