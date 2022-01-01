import SmartView from '../smart-view.js';
import { createFilmDetailsTemplate } from './film-details-view.tmpl.js';


export default class FilmDetailsView extends SmartView {
  constructor(film, comments) {
    super();

    this._state = FilmDetailsView.mapFilmDataToState(film, comments);

    this.element.addEventListener('scroll', this.#scrollHandler);
    this.setEmojiClickHandler();
    this.setCommentInputHandler();
  }

  get film() {
    return this._state.film;
  }

  get comments() {
    return this._state.comments;
  }

  get template() {
    return createFilmDetailsTemplate(this.film, this.comments, this._state.currentComment);
  }

  setClickCloseHandler = (handler) => {
    this._callbacks.clickClose = handler;

    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickCloseHandler);
  }

  setClickControlsHandler = (handler) => {
    this._callbacks.clickControl = handler;

    const controls = this.element.querySelectorAll('.film-details__control-button');
    controls.forEach(
      (control) => control.addEventListener('click', this.#clickControlHandler)
    );
  }

  setEmojiClickHandler = () => {
    const emojiLabels = this.element.querySelectorAll('.film-details__emoji-item');
    emojiLabels.forEach(
      (emojiLabel) => emojiLabel.addEventListener('change', this.#clickEmojiHandler)
    );
  }

  setCommentInputHandler = () => {
    const commentInput = this.element.querySelector('.film-details__comment-input');
    commentInput.addEventListener('input', this.#changeCommentInputHandler);
  }

  updateElements = () => {
    super.updateElements();
    this.element.scrollTop = this._state.scrollPosition;

    const emojiRadio = this.element.querySelector(`#emoji-${this._state.currentComment.emotion}`);
    if (emojiRadio !== null) {
      emojiRadio.checked = true;
    }
  }

  restoreHandlers = () => {
    this.element.addEventListener('scroll', this.#scrollHandler);
    this.setEmojiClickHandler();
    this.setCommentInputHandler();
    this.setClickCloseHandler(this._callbacks.clickClose);
    this.setClickControlsHandler(this._callbacks.clickControl);
  }

  #changeCommentInputHandler = ({ target }) => {
    const newState = { ...this._state };
    newState.currentComment.comment = target.value;

    this.updateState(newState, true);
  }

  #clickEmojiHandler = ({ target }) => {
    const newState = { ...this._state };
    newState.currentComment.emotion = target.value;

    this.updateState(newState, false);
  }

  #clickControlHandler = (evt) => {
    evt.preventDefault();
    const { target } = evt;

    const filmUpdate = { ...this.film };
    if (target.classList.contains('film-details__control-button--favorite')) {
      filmUpdate.userDetails.favorite = !this.film.userDetails.favorite;
    } else if (target.classList.contains('film-details__control-button--watchlist')) {
      filmUpdate.userDetails.watchlist = !this.film.userDetails.watchlist;
    } else if (target.classList.contains('film-details__control-button--watched')) {
      filmUpdate.userDetails.alreadyWatched = !this.film.userDetails.alreadyWatched;
    }

    const newState = { ...this._state };
    newState.film = filmUpdate;
    this.updateState(newState, false);


    this._callbacks.clickControl(filmUpdate);
  };

  #clickCloseHandler = (evt) => {
    evt.preventDefault();

    this._callbacks.clickClose();
  }

  #scrollHandler = ({ target }) => {
    this._state.scrollPosition = target.scrollTop;
  }


  static mapFilmDataToState = (film, comments) => ({
    film,
    comments,
    currentComment: {
      comment: '',
      emotion: null,
    },
    scrollPosition: 0,
  })
}
