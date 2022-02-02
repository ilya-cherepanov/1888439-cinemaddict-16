const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptFilmToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  getComments = async (filmId) => (
    await ApiService.parseResponse(await this.#load({ url: `comments/${filmId}` }))
  )

  createComment = async (comment, filmId) => {
    const response = await this.#load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptCommentToServer(comment)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComment = async (commentId) => (
    await this.#load({ url: `comments/${commentId}`, method: Method.DELETE })
  )

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', `Basic ${this.#authorization}`);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptFilmToServer = (film) => {
    const adaptedFilm = {
      ...film,
      ['film_info']: film.filmInfo,
      ['user_details']: film.userDetails,
    };
    adaptedFilm['film_info']['alternative_title'] = film.filmInfo.alternativeTitle;
    adaptedFilm['film_info']['total_rating'] = film.filmInfo.totalRating;
    adaptedFilm['film_info']['age_rating'] = film.filmInfo.ageRating;
    adaptedFilm['film_info']['release']['release_country'] = film.filmInfo.release.country;

    adaptedFilm['user_details']['already_watched'] = film.userDetails.alreadyWatched;
    adaptedFilm['user_details']['watching_date'] = film.userDetails.watchingDate;

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm['film_info'].alternativeTitle;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['film_info'].release.country;
    delete adaptedFilm['user_details'].alreadyWatched;
    delete adaptedFilm['user_details'].watchingDate;

    return adaptedFilm;
  }

  #adaptCommentToServer = (comment) => {
    const adaptedComment = {
      ...comment,
    };

    return adaptedComment;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
