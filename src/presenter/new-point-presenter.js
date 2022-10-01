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

  constructor (eventListContainer, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#destroyCallback = callback;
    this.#offers = offers;
    this.#destinations = destinations;

    if (this.#addPointComponent !== null) {
      return;
    }

    this.#addPointComponent = new EditPointView(this.#info, this.#offers, this.#destinations, formViewTypeButton.ADD_FORM);
    this.#addPointComponent.setSubmitFormHandler(this.#handleFormSubmit);
    this.#addPointComponent.setResetFormHandler(this.#handleFormReset);

    render(this.#addPointComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.querySelector('.trip-main__event-add-btn').disabled = true;
    document.addEventListener('keydown', this.#onEscKeyDownResetNewPointForm);
  };

  destroy = () => {
    if (!this.#addPointComponent) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#addPointComponent);
    this.#addPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDownResetNewPointForm);
  };

  setSaving = () => {
    this.#addPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  #handleFormReset = () => {
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };

  #handleFormSubmit = (point) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);

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
