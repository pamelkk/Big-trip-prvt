import { remove, render, RenderPosition } from '../framework/render';
import { formViewTypeButton, UpdateType, UserAction } from '../mock/const';
import { isEscPressed } from '../utils';
import EditPointView from '../view/edit-point-view';

export default class NewPointPresenter {
  #addPointComponent = null;
  #changeData = null;
  #eventListContainer = null;
  #destroyCallback = null;
  #info = null;

  constructor (eventListContainer, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
  }

  init = (callback, info) => {
    this.#destroyCallback = callback;
    this.#info = info;

    if (this.#addPointComponent !== null) {
      return;
    }

    this.#addPointComponent = new EditPointView(this.#info, formViewTypeButton.ADD_FORM);
    this.#addPointComponent.setSubmitFormHandler(this.#handleFormSubmit);
    this.#addPointComponent.setResetFormHandler(this.#handleFormReset);

    render(this.#addPointComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.querySelector('.trip-main__event-add-btn').disabled = true;
    document.addEventListener('keydown', this.#onEscKeyDownResetNewPointForm);
  };

  destroy = () => {
    if (this.#addPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#addPointComponent);
    this.#addPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDownResetNewPointForm);
  };

  #handleFormReset = () => {
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };

  #handleFormSubmit = (point) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);
    this.destroy();

    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };

  #onEscKeyDownResetNewPointForm = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    }
  };
}
