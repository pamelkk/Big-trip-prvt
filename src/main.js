import PointModel from './model/point-model';
import AppPresenter from './presenter/app-presenter';
import { render } from './framework/render';
import FiltersView from './view/filters-view';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const tripFiltersElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const appPresenter = new AppPresenter();
const pointModel = new PointModel();

render(new FiltersView(), tripFiltersElement);

appPresenter.init(tripEventsElement, pointModel);
