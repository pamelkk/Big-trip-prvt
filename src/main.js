import PointModel from './model/point-model';
import AppPresenter from './presenter/app-presenter';
import { render } from './framework/render';
import FiltersView from './view/filters-view';
import SortingView from './view/sorting-view';
import { SORTING } from './mock/const';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const tripFiltersElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const appPresenter = new AppPresenter();
const pointModel = new PointModel();

render(new FiltersView(), tripFiltersElement);
render(new SortingView(SORTING), tripEventsElement);

appPresenter.init(tripEventsElement, pointModel);
