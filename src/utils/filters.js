import { FilmsFilterType } from '../constants.js';


const Filters = {
  [FilmsFilterType.NOTHING]: (films) => films.filter(() => false),
  [FilmsFilterType.ALL]: (films) => films.filter(() => true),
  [FilmsFilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilmsFilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilmsFilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
};


export { Filters };
