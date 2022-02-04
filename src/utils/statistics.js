import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { StatisticsInterval } from '../constants.js';

dayjs.extend(isSameOrAfter);


const countGenres = (films) => {
  const genres = {};

  for (const film of films) {
    for (const genre of film.filmInfo.genre) {
      if (!genres[genre]) {
        genres[genre] = 1;
      } else {
        genres[genre] += 1;
      }
    }
  }

  return genres;
};


const createTimeFilter = (interval) => {
  if (interval === StatisticsInterval.ALL_TIME) {
    return () => true;
  }

  let afterDate = dayjs();

  switch (interval) {
    case StatisticsInterval.TODAY:
      afterDate = afterDate.subtract(1, 'day');
      break;
    case StatisticsInterval.WEEK:
      afterDate = afterDate.subtract(1, 'week');
      break;
    case StatisticsInterval.MONTH:
      afterDate = afterDate.subtract(1, 'month');
      break;
    case StatisticsInterval.YEAR:
      afterDate = afterDate.subtract(1, 'year');
      break;
  }

  return (film) => (
    dayjs(film.userDetails.watchingDate).isSameOrAfter(afterDate)
  );
};


const filterByTimeInterval = (films, interval) => {
  const timeFilter = createTimeFilter(interval);

  return films.filter(
    (film) => film.userDetails.alreadyWatched && timeFilter(film),
  );
};


const sortGenres = (genres) => Object.entries(genres).sort((lhs, rhs) => rhs[1] - lhs[1]);


const getTopGenre = (watchedGenres) => {
  const sortedGenres = sortGenres(watchedGenres);

  if (sortedGenres.length <= 0) {
    return '';
  }

  return sortedGenres[0][0];
};


const getTotalDuration = (watchedFilms) => (
  watchedFilms.reduce((accumulator, film) => accumulator + film.filmInfo.runtime, 0)
);


export {
  countGenres,
  createTimeFilter,
  filterByTimeInterval,
  sortGenres,
  getTopGenre,
  getTotalDuration
};
