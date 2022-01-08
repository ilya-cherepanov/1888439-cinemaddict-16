import MoviePresenter from './presenter/movie-presenter.js';
import NavigationPresenter from './presenter/navigation-presener.js';
import FilmsModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-modes.js';
import { createFilms } from './mocking.js';
import { Films, NavigationItemsType } from './constants.js';

const filmsModel = new FilmsModel();
filmsModel.films = createFilms(Films.COUNT);
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

new MoviePresenter(filmsModel, commentsModel, filterModel);
const navigationPresenter = new NavigationPresenter(filterModel, filmsModel);
navigationPresenter.init();
