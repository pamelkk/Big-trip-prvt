import PointModel from './model/point-model';
import AppPresenter from './presenter/app-presenter';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const tripFiltersElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const pointModel = new PointModel();
const filterModel = new FilterModel();
const appPresenter = new AppPresenter(tripEventsElement, pointModel, filterModel);
const filterPresenter = new FilterPresenter(tripFiltersElement, pointModel, filterModel);

filterPresenter.init();
appPresenter.init();
