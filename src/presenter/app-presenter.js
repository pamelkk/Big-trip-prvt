import { render } from '../render';
import ListPointsView from '../view/points-list-view';
import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import AddPointView from '../view/add-point-view';
import { getRandomElement } from '../utils';

export default class AppPresenter {
  eventListComponent = new ListPointsView();
  editEventComponent = new EditPointView();
  addEventComponent = new AddPointView();

  init = (appContainer, pointModel) => {
    this.appContainer = appContainer;
    this.pointModel = pointModel;
    this.points = [...pointModel.getPoints()];
    this.offers = [...pointModel.getOffers()];
    this.destinations = [...pointModel.getDestinations()];
    const pointForEdit = getRandomElement(this.points);
    const selectedOffersForEdit = this.offers.filter((item) => item.type === pointForEdit.type);
    const selectedDestinationForEdit = this.destinations.filter((item) => item.id === pointForEdit.destination);

    render(this.eventListComponent, this.appContainer);
    render(new EditPointView(selectedDestinationForEdit, pointForEdit, selectedOffersForEdit), this.eventListComponent.getElement());
    render(this.addEventComponent, this.eventListComponent.getElement());

    for(let i = 0; i < this.points.length; i++) {
      for (let j = 0; j < this.offers.length; j++) {
        const destination = this.destinations.find((item) => item.id === this.points[i].destination);

        const selectedOffers = this.offers.filter((item) => item.type === this.points[i].type);

        this.points[i].offers = selectedOffers;

        render(new PointView(this.points[i], destination, selectedOffers), this.eventListComponent.getElement());
      }
    }
  };
}
