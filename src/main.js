import MoviePresenter from './presenter/movie-presenter.js';
import { createFilms } from './mocking.js';
import { Films } from './constants.js';

new MoviePresenter(createFilms(Films.COUNT));
