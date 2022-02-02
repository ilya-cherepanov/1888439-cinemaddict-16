import AbstractObservable from '../utils/abstract-observable.js';
import { UpdateType } from '../constants.js';


export default class FilmsModel extends AbstractObservable {
  #films = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(FilmsModel.adaptFilmToClient);
    } catch (err) {
      this.#films = [];
    }


    this.notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update nonexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = FilmsModel.adaptFilmToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this.notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film!');
    }
  }

  replaceFilm = (newFilm) => {
    const index = this.#films.findIndex((film) => film.id === newFilm.id);

    if (index === -1) {
      throw new Error('Can\'t replace film!');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      newFilm,
      ...this.#films.slice(index + 1),
    ];
  }

  static adaptFilmToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: { ...film['film_info'] },
      userDetails: { ...film['user_details'] },
    };

    adaptedFilm.filmInfo.alternativeTitle = film['film_info']['alternative_title'];
    adaptedFilm.filmInfo.totalRating = film['film_info']['total_rating'];
    adaptedFilm.filmInfo.ageRating = film['film_info']['age_rating'];
    adaptedFilm.filmInfo.release = { ...film['film_info']['release'] };
    adaptedFilm.filmInfo.release.country = film['film_info']['release']['release_country'];

    adaptedFilm.userDetails.alreadyWatched = film['user_details']['already_watched'];
    adaptedFilm.userDetails.watchingDate = film['user_details']['watching_date'];

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo.release['release_country'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  }
}
