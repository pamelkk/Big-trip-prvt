import AbstractionView from './abstraction-view';

const createListTripPointsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListPointsView extends AbstractionView {
  getTemplate() {
    return createListTripPointsTemplate();
  }
}
