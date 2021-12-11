import { formatFilmsCount } from '../../utils/format.js';


const createStatisticsTemplate = (filmsCount) => `<p>${formatFilmsCount(filmsCount)} movies inside</p>`;


export { createStatisticsTemplate };
