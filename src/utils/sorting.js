import { FilmsListExtraType } from '../constants.js';

const sortFilms = (films, compareFunc, count = 2) => (
  [...films].sort(compareFunc).slice(0, count)
);


const compareByRating =
  (firstFilm, secondFilm) => secondFilm.filmInfo.totalRating - firstFilm.filmInfo.totalRating;


const compareByCommentsCount =
  (firstFilm, secondFilm) => secondFilm.comments.length - firstFilm.comments.length;


const getComparer = (filmsListExtraType) => {
  switch (filmsListExtraType) {
    case FilmsListExtraType.TOP_RATED:
      return compareByRating;
    case FilmsListExtraType.MOST_COMMENTED:
      return compareByCommentsCount;
    default:
      return () => 0;
  }
};


export {
  sortFilms,
  getComparer
};
