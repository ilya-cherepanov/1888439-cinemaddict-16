import dayjs from 'dayjs';


const compareByRating =
  (firstFilm, secondFilm) => secondFilm.filmInfo.totalRating - firstFilm.filmInfo.totalRating;


const compareByDate =
  (firstFilm, secondFilm) => dayjs(secondFilm.filmInfo.release.date).diff(dayjs(firstFilm.filmInfo.release.date));


export {
  compareByDate,
  compareByRating,
};
