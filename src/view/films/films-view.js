import AbstractView from '../abstract-view.js';
import { createFilmsTemplate } from './films-view.tmpl.js';


export default class FilmsView extends AbstractView {
  get template() {
    return createFilmsTemplate();
  }
}
