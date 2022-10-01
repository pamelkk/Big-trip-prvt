import PointModel from './model/point-model';
import AppPresenter from './presenter/app-presenter';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import PointsApiService from './points-api-service';
import DestinationsApiService from './destinations-api-service';
import OffersApiService from './offers-api-service';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const AUTHORIZATION = 'Basic jshrg4837wdaikd3';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
const addNewButton = document.querySelector('.trip-main__event-add-btn');
addNewButton.style.display = 'none';

const tripFiltersElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const tripMainInfoElement = headerElement.querySelector('.trip-main');
const pointModel = new PointModel(new PointsApiService(END_POINT, AUTHORIZATION), new DestinationsApiService(END_POINT, AUTHORIZATION), new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const appPresenter = new AppPresenter(tripEventsElement, pointModel, filterModel, tripMainInfoElement);
const filterPresenter = new FilterPresenter(tripFiltersElement, pointModel, filterModel);

filterPresenter.init();
appPresenter.init();
pointModel.init().finally(() => {
  addNewButton.style.display = 'flex';
});
