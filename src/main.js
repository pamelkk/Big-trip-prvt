import AppPresenter from './presenter/app-presenter';
import { render } from './render';
import FiltersView from './view/filters-view';
import SortingView from './view/sorting-view';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const tripFiltersElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const appPresenter = new AppPresenter();

render(new FiltersView(), tripFiltersElement);
render(new SortingView(), tripEventsElement);

appPresenter.init(tripEventsElement);
