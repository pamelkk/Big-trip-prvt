import { remove, render, replace } from '../framework/render';
import { onEscKeyDownHandler } from '../utils';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;
  #info = null;
  #eventListComponent = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #changeData = null;

  constructor (eventListComponent, changeData, changeMode) {
    this.#eventListComponent = eventListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (info) => {
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#info = info;
    this.#pointComponent = new PointView(this.#info);
    this.#editPointComponent = new EditPointView(this.#info);
    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#editPointComponent.setSubmitFormHandler(this.#handleFormSubmit);
    this.#editPointComponent.setResetFormHandler(this.#handleFormReset);
    this.#editPointComponent.setFormClickHandler(this.#handleFormClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#eventListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#info);
      this.#replaceEditPointToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  #resetRemoveEditPoint = () => {
    this.#editPointComponent.reset(this.#info);
    this.#replaceEditPointToPoint();
  };

  #replacePointToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', onEscKeyDownHandler && this.#resetRemoveEditPoint);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', onEscKeyDownHandler && this.#resetRemoveEditPoint);
    this.#mode = Mode.DEFAULT;
  };

  #handleEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #handleFormSubmit = (info) => {
    this.#changeData(info);
    this.#replaceEditPointToPoint();
  };

  #handleFormReset = () => {
    this.destroy();
  };

  #handleFormClick = () => {
    this.#replaceEditPointToPoint();
  };
}
