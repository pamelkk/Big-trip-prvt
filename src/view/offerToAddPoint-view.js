import GetRemoveElement from './getOrRemoveElements-view';

const createOfferToAddPointTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class OfferToAddPointView extends GetRemoveElement {
  getTemplate() {
    return createOfferToAddPointTemplate();
  }
}
