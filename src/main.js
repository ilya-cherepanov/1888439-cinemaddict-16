import MoviePresenter from './presenter/movie-presenter.js';
import { createFilms } from './mocking.js';
import { Films } from './constants.js';

const moviePresenter = new MoviePresenter(createFilms(Films.COUNT));
