import PointModel from './model/point-model';
import AppPresenter from './presenter/app-presenter';
import { render } from './framework/render';
import FiltersView from './view/filters-view';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const tripFiltersElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const pointModel = new PointModel();
const appPresenter = new AppPresenter(tripEventsElement, pointModel);

render(new FiltersView(), tripFiltersElement);

appPresenter.init();
