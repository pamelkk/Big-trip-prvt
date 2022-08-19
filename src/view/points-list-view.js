import GetRemoveElement from './getOrRemoveElements-view';

const createListTripPointsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListPointsView extends GetRemoveElement {
  getTemplate() {
    return createListTripPointsTemplate();
  }
}
