const TYPE_OF_TRANSPORT = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SortType = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
  ERROR: 'error'
};

const MinutesCount = {
  MINUTES_IN_HOURS: 60,
  MINUTES_IN_DAY: 1440,
};

const formViewTypeButton = {
  ADD_FORM: 'Cancel',
  EDIT_FORM: 'Delete',
};

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.ERROR]: 'Oops..the server has problems. Pls try again later',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
  ADD_POINT: 'ADD_POINT',
};

export {TYPE_OF_TRANSPORT, formViewTypeButton, SortType, MinutesCount, UpdateType, UserAction, FilterType, NoPointsTextType};

