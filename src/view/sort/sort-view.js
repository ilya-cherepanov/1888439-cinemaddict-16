import AbstractView from '../abstract-view.js';
import { createSortTemplate } from './sort-view.tmpl.js';


export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}
