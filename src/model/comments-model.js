import AbstractObservable from '../utils/abstract-observable.js';
import FilmsModel from './films-model.js';


export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (filmId) => {
    try {
      const comments = await this.#apiService.getComments(filmId);
      this.#comments = comments.map(CommentsModel.adaptCommentToClient);
    } catch (err) {
      this.#comments = [];
    }
  }

  createComment = async (updateType, update) => {
    try {
      const response = await this.#apiService.createComment(update.comment, update.film.id);

      const comments = response.comments.map(CommentsModel.adaptCommentToClient);
      this.#comments = comments;

      const film = FilmsModel.adaptFilmToClient(response.movie);

      this.notify(updateType, { film, comments });
    } catch (err) {
      throw new Error('Can\'t create comment!');
    }
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.commentId);

    if (index === -1) {
      throw new Error('Can\'t delete nonexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update.commentId);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      const newFilm = update.film;
      newFilm.comments = newFilm.comments.filter((comment) => comment !== update.commentId);

      this.notify(updateType, { film: newFilm, comments: this.#comments });
    } catch (err) {
      throw new Error('Can\'t delete comment!');
    }
  }

  static adaptCommentToClient = (comment) => {
    const adaptedComment = {
      ...comment,
    };

    return adaptedComment;
  }
}
