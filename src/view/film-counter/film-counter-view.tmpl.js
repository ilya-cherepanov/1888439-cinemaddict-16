import { formatFilmsCount } from '../../utils/format.js';


const createFilmCounterTemplate = (filmsCount) => `<p>${formatFilmsCount(filmsCount)} movies inside</p>`;


export { createFilmCounterTemplate };
