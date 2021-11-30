import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';


dayjs.extend(duration);


const formatFilmDuration = (film) => {
  const durationString = dayjs.duration(film.runtime, 'minute').format('H[h] m[m]');

  return durationString.startsWith('0h') ? durationString.substring(3) : durationString;
};


const formatTotalRating = (rating) => rating.toFixed(1);


const formatCommentDate = (date) => (
  dayjs(date).format('YYYY/MM/D')
);


const formatReleaseDate = (date) => (
  dayjs(date).format('D MMMM YYYY')
);


const formatShortDescription = (description, length = 140) => (
  description.length < length ? description : `${description.slice(0, length)}...`
);


const formatReleaseYear = (date) => dayjs(date).year();


const reverseString = (str) => (
  str.split('').reverse().join('')
);

const formatFilmsCount = (count, groupBy = 3) => {
  const regex = new RegExp(`.{1,${groupBy}}`, 'g');

  return reverseString(reverseString(String(count)).match(regex).join(' '));
};

export {
  formatFilmDuration,
  formatTotalRating,
  formatCommentDate,
  formatReleaseDate,
  formatShortDescription,
  formatReleaseYear,
  formatFilmsCount
};
