import { render, replace } from '../framework/render';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;
  #info = null;
  #eventListComponent = null;

  constructor (eventListComponent) {
    this.#eventListComponent = eventListComponent;
  }

  init = (info) => {
    this.#info = info;

    this.#pointComponent = new PointView(info);
    this.#editPointComponent = new EditPointView(info);
    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setFormClickHandler(this.#handleFormClick);

    render(this.#pointComponent, this.#eventListComponent);
  };

  #replacePointToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDownHandler);
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
  };

  #onEscKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditPointToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #handleFormSubmit = () => {
    this.#replaceEditPointToPoint();
  };

  #handleFormClick = () => {
    this.#replaceEditPointToPoint();
  };
}
