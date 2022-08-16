import { render } from '../render';
import ListEventsView from '../view/events-list-view';
import EditEventView from '../view/edit-event-view';
import AddEventView from '../view/add-event-view';
import PointView from '../view/point-view';

export default class AppPresenter {
  eventListComponent = new ListEventsView();
  editEventComponent = new EditEventView();
  addEventComponent = new AddEventView();

  init = (appContainer, pointModel) => {
    this.appContainer = appContainer;
    this.pointModel = pointModel;
    this.points = [...pointModel.getPoints()];
    this.offers = [...pointModel.getOffers()];
    this.destinations = [...pointModel.getDestinations()];

    render(this.eventListComponent, this.appContainer);
    render(this.editEventComponent, this.eventListComponent.getElement());
    render(this.addEventComponent, this.eventListComponent.getElement());

    for(let i = 0; i < this.points.length; i++) {

      const destination = this.destinations.find((item) => item.id === this.points[i].destination);

      const selectedOffers = this.offers.filter((item) => this.points[i].offers.some((offerId) => offerId === item.id));

      render(new PointView(this.points[i], destination, selectedOffers), this.eventListComponent.getElement());
    }
  };
}
