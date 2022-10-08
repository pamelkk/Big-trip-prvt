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
  #offers = [];
  #destinations = [];
  #addNewButtonElement = null;

  constructor (eventListContainer, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations, addNewButtonElement) => {
    this.#destroyCallback = callback;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#addNewButtonElement = addNewButtonElement;

    if (this.#addPointComponent !== null) {
      return;
    }

    this.#addPointComponent = new EditPointView(this.#info, this.#offers, this.#destinations, formViewTypeButton.ADD_FORM);
    this.#addPointComponent.setSubmitFormHandler(this.#handleFormSubmit);
    this.#addPointComponent.setResetFormHandler(this.#handleFormReset);

    render(this.#addPointComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    this.#addNewButtonElement.element.disabled = true;
    document.addEventListener('keydown', this.#onEscKeyDownResetNewPointFormHandler);
  };

  destroy = () => {
    if (!this.#addPointComponent) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#addPointComponent);
    this.#addPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDownResetNewPointFormHandler);
  };

  setSaving = () => {
    this.#addPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  #handleFormReset = () => {
    this.destroy();
    this.#addNewButtonElement.element.disabled = false;
  };

  #handleFormSubmit = (point) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);

    this.#addNewButtonElement.element.disabled = false;
  };

  #onEscKeyDownResetNewPointFormHandler = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
      this.#addNewButtonElement.element.disabled = false;
    }
  };
}
