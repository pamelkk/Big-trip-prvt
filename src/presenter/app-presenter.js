import { render } from '../render';
import EventView from '../view/event-view';
import ListEventsView from '../view/events-list-view';
import EditEventView from '../view/edit-event-view';
import AddEventView from '../view/add-event-view';
const countEvent = 3;

export default class AppPresenter {
  eventListComponent = new ListEventsView();
  editEventComponent = new EditEventView();
  addEventComponent = new AddEventView();

  init = (appContainer) => {
    this.appContainer = appContainer;

    render(this.eventListComponent, this.appContainer);
    render(this.editEventComponent, this.eventListComponent.getElement());
    render(this.addEventComponent, this.eventListComponent.getElement());

    for(let i = 0; i < countEvent; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    }
  };
}
