import { remove, render, replace } from '../framework/render';
import { formViewTypeButton, UpdateType, UserAction } from '../mock/const';
import { isEscPressed } from '../utils';
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
  #offers = [];
  #destinations = [];

  constructor (eventListComponent, changeData, changeMode) {
    this.#eventListComponent = eventListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (info, offers, destinations) => {
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#info = info;
    this.#pointComponent = new PointView(this.#info, this.#offers, this.#destinations);
    this.#editPointComponent = new EditPointView(this.#info, this.#offers, this.#destinations, formViewTypeButton.EDIT_FORM);
    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#editPointComponent.setSubmitFormHandler(this.#handleFormSubmit);
    this.#editPointComponent.setResetFormHandler(this.#handleFormReset);
    this.#editPointComponent.setFormClickHandler(this.#handleFormClick);

    if (!prevPointComponent || !prevEditPointComponent) {
      render(this.#pointComponent, this.#eventListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
      this.#mode = Mode.DEFAULT;
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

  setAborting = () => {
    if(this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#editPointComponent.shake(resetFormState);
  };

  setSaving = () => {
    if(this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if(this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  #replacePointToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDownReplaceEditToPointHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeyDownReplaceEditToPointHandler);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDownReplaceEditToPointHandler = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#info);
      this.#replaceEditPointToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = this.#info.type !== update.type || this.#info.offers !== update.offers || this.#info.destination !== update.destination;
    this.#changeData(UserAction.UPDATE_POINT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, update);
    if(!isMinorUpdate) {
      this.#replaceEditPointToPoint();
    }
  };

  #handleFormReset = (info) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, info);
  };

  #handleFormClick = () => {
    this.#replaceEditPointToPoint();
  };
}
