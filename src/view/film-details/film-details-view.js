import SmartView from '../smart-view.js';
import he from 'he';
import { createFilmDetailsTemplate } from './film-details-view.tmpl.js';
import { UserAction, UpdateType } from '../../constants.js';


export default class FilmDetailsView extends SmartView {
  constructor(film, comments) {
    super();

    this._state = FilmDetailsView.mapFilmDataToState(film, comments);

    this.element.addEventListener('scroll', this.#handleScroll);
    this.setEmojiClickHandler();
    this.setCommentInputHandler();
    this.setDeleteCommentHandler();
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
      .addEventListener('click', this.#handleClickClose);
  }

  setClickControlsHandler = (handler) => {
    this._callbacks.clickControl = handler;

    const controls = this.element.querySelectorAll('.film-details__control-button');
    controls.forEach(
      (control) => control.addEventListener('click', this.#handleClickControl)
    );
  }

  setEmojiClickHandler = () => {
    const emojiLabels = this.element.querySelectorAll('.film-details__emoji-item');
    emojiLabels.forEach(
      (emojiLabel) => emojiLabel.addEventListener('change', this.#handleClickEmoji)
    );
  }

  setCommentInputHandler = () => {
    const commentInput = this.element.querySelector('.film-details__comment-input');
    commentInput.addEventListener('input', this.#handleChangeCommentInput);
  }

  setViewActionHandler = (handler) => {
    this._callbacks.viewAction = handler;
  }

  updateElements = () => {
    super.updateElements();
    this.element.scrollTop = this._state.scrollPosition;

    const emojiRadio = this.element.querySelector(`#emoji-${this._state.currentComment.emotion}`);
    if (emojiRadio !== null) {
      emojiRadio.checked = true;
    }
  }

  updateData = ({ film, comments }) => {
    this.updateState({ film: film, comments: comments, currentComment: { comment: '', emotion: null } }, false);
  }

  restoreHandlers = () => {
    this.element.addEventListener('scroll', this.#handleScroll);
    this.setEmojiClickHandler();
    this.setCommentInputHandler();
    this.setClickCloseHandler(this._callbacks.clickClose);
    this.setClickControlsHandler(this._callbacks.clickControl);
    this.setDeleteCommentHandler();
  }

  setDeleteCommentHandler = () => {
    const deleteButtons = this.element.querySelectorAll('.film-details__comment-delete');

    deleteButtons.forEach(
      (deleteButton) => deleteButton.addEventListener('click', this.#handleDeleteComment)
    );
  }

  initSendComment = () => {
    if (this._state.currentComment.comment === '' || this._state.currentComment.emotion === null) {
      return;
    }

    this.updateState( { isCommentCreating: true }, true);
    this.#handleCreateComment();
  }

  #showShakeAnimation = (element) => {
    element.addEventListener('animationend', this.#handleShakeAnimationEnd);

    element.classList.add('shake');
  }

  #setCommentFormActivity = (enabled) => {
    const commentTextarea = this.element.querySelector('.film-details__comment-input');
    commentTextarea.disabled = !enabled;

    const emojiInputs = this.element.querySelectorAll('.film-details__emoji-item');
    emojiInputs.forEach((emojiInput) => { emojiInput.disabled = !enabled; });
  }

  #handleDeleteComment = async (evt) => {
    evt.preventDefault();
    if (this._state.isCommentDeleting) {
      return;
    }

    this.updateState({ isCommentDeleting: true }, true);
    const { target } = evt;
    target.textContent = 'Deleting...';

    try {
      await this._callbacks.viewAction(UserAction.REMOVE_COMMENT, UpdateType.POPUP, { film: this._state.film, commentId: target.dataset.id });
    } catch (err) {
      target.textContent = 'Delete';
      this.#showShakeAnimation(target.closest('.film-details__comment'));
    }

    this.updateState({ isCommentDeleting: false }, true);
  }

  #handleCreateComment = async () => {

    this.#setCommentFormActivity(false);

    try {
      await this._callbacks.viewAction(UserAction.ADD_COMMENT, UpdateType.POPUP, { film: this._state.film, comment: this._state.currentComment });
    } catch (err) {
      this.#showShakeAnimation(this.element.querySelector('.film-details__new-comment'));
    }

    this.updateState({ isCommentCreating: false }, true);
    this.#setCommentFormActivity(true);
  }

  #handleShakeAnimationEnd = ({ target }) => {
    target.classList.remove('shake');
    target.removeEventListener('animationend', this.#handleShakeAnimationEnd);
  }

  #handleChangeCommentInput = ({ target }) => {
    const newState = { ...this._state };
    newState.currentComment.comment = he.escape(target.value);

    this.updateState(newState, true);
  }

  #handleClickEmoji = ({ target }) => {
    if (this._state.isCommentCreating) {
      return;
    }

    const newState = { ...this._state };
    newState.currentComment.emotion = target.value;

    this.updateState(newState, false);
  }

  #handleClickControl = async (evt) => {
    evt.preventDefault();
    const { target } = evt;

    const filmUpdate = { ...this.film,  userDetails: { ...this.film.userDetails } };
    if (target.classList.contains('film-details__control-button--favorite')) {
      filmUpdate.userDetails.favorite = !this.film.userDetails.favorite;
    } else if (target.classList.contains('film-details__control-button--watchlist')) {
      filmUpdate.userDetails.watchlist = !this.film.userDetails.watchlist;
    } else if (target.classList.contains('film-details__control-button--watched')) {
      filmUpdate.userDetails.alreadyWatched = !this.film.userDetails.alreadyWatched;
    }

    await this._callbacks.viewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, filmUpdate);
  };

  #handleClickClose = (evt) => {
    evt.preventDefault();

    this._callbacks.clickClose();
  }

  #handleScroll = ({ target }) => {
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
    isCommentDeleting: false,
    isCommentCreating: false,
  })
}
