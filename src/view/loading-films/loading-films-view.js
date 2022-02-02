import AbstractView from '../abstract-view.js';
import { createLoadingFilmsTemplate } from './loading-films.tmpl.js';

export default class LoadingFilmsView extends AbstractView {
  get template() {
    return createLoadingFilmsTemplate();
  }
}
