import PointModel from './model/point-model';
import AppPresenter from './presenter/app-presenter';
import FilterModel from './model/filter-model';
import PointsApiService from './points-api-service';
import DestinationsApiService from './destinations-api-service';
import OffersApiService from './offers-api-service';
import NewEventButtonView from './view/new-event-button-view';
import { render } from './framework/render';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripFiltersElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const tripMainInfoElement = headerElement.querySelector('.trip-main');

const AUTHORIZATION = 'Basic jshrg4837wdaikd3a';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const addNewButtonElement = new NewEventButtonView();
const pointModel = new PointModel(new PointsApiService(END_POINT, AUTHORIZATION), new DestinationsApiService(END_POINT, AUTHORIZATION), new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const appPresenter = new AppPresenter(tripEventsElement, pointModel, filterModel, tripMainInfoElement, tripFiltersElement, addNewButtonElement);

const initPointsModel = async () => {
  if(await pointModel.init() instanceof Error) {
    return;
  }
  render(addNewButtonElement, tripMainInfoElement);
};

appPresenter.init();
initPointsModel();
