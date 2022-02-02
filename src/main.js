import MoviePresenter from './presenter/movie-presenter.js';
import NavigationPresenter from './presenter/navigation-presener.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import { NavigationItemsType } from './constants.js';
import ApiService from './api-service.js';
import StatisticsView from './view/statistics/statistics-view.js';
import { render, RenderPosition } from './utils/render.js';

const AUTHORIZATION = 'adg7723bcls';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const apiService = new ApiService(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel(apiService);
const commentsModel = new CommentsModel(apiService);
const filterModel = new FilterModel();

const moviePresenter = new MoviePresenter(filmsModel, commentsModel, filterModel);

let statisticsView = null;

const navigationCallback = (navigationItem) => {
  switch (navigationItem) {
    case NavigationItemsType.FILMS:
      if (statisticsView !== null) {
        statisticsView.removeElement();
        statisticsView = null;
      }
      moviePresenter.init();
      break;
    case NavigationItemsType.STATISTICS:
      moviePresenter.destroy();
      statisticsView = new StatisticsView(filmsModel.films);
      render(document.querySelector('.main'), statisticsView, RenderPosition.BEFOREEND);
      break;
  }
};

const navigationPresenter = new NavigationPresenter(filterModel, filmsModel, navigationCallback);
navigationPresenter.init();

filmsModel.init();
