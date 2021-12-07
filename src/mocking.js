import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import {
  getOneRandomArrayElement,
  getRandomText,
  getRandomFixedPoint,
  getRandomArrayElements,
  getRandomInt,
  getRandomBool,
} from './utils/random.js';


const FILM_TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const FILM_POSTERS = [
  'the-dance-of-life.jpg',
  'sagebrush-trail.jpg',
  'the-man-with-the-golden-arm.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'popeye-meets-sinbad.png',
  'the-great-flamarion.jpg',
  'made-for-each-other.png',
];

const NAMES = [
  'Adam Robbins',
  'Renee Nichols',
  'Willie Hayes',
  'Harry Pratt',
  'Tara Hill',
  'Carlos Bush',
  'Tom Ford',
  'Takeshi Kitano',
  'Morgan Freeman',
];

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const GENRES = [
  'Drama',
  'Comedy',
  'Sci-Fi',
  'Adventure',
  'Mystery',
  'Horror',
  'Action',
];

const COUNTRIES = [
  'Russia',
  'USA',
  'France',
  'Germany',
  'United Kingdom',
  'South Korea',
];

const AGE_RATINGS = [
  0,
  6,
  12,
  16,
  18,
];

const Rating = {
  MIN: 1,
  MAX: 10,
  PRECISION: 1,
};

const Runtime = {
  MIN: 10,
  MAX: 240,
};

const GenresCount = {
  MIN: 1,
  MAX: 3,
};

const Writers = {
  MIN: 1,
  MAX: 3,
};

const Actors = {
  MIN: 1,
  MAX: 3,
};

const MAX_COMMENTS_PER_FILM = 5;


dayjs.extend(duration);


const createDate = (minDaysAgo = 0, maxDaysAgo = 35000) => (
  dayjs()
    .subtract(dayjs.duration({ days: getRandomInt(minDaysAgo, maxDaysAgo) }))
    .toISOString()
);


const createCommentDate = (minSecondsAgo = 0, maxSecondsAgo = 1000000) => (
  dayjs()
    .subtract(dayjs.duration({ seconds: getRandomInt(minSecondsAgo, maxSecondsAgo) }))
    .toISOString()
);


const createOneComment = (id, isLocal) => {
  const nonLocalFields = isLocal ? {} : {
    id,
    author: getOneRandomArrayElement(NAMES),
    date: createCommentDate(),
  };

  return {
    comment: getRandomText(),
    emotion: getOneRandomArrayElement(EMOTIONS),
    ...nonLocalFields,
  };
};


const getRandomPoster = () => `./images/posters/${getOneRandomArrayElement(FILM_POSTERS)}`;


const createOneFilm = (id, comments) => {
  const title = getOneRandomArrayElement(FILM_TITLES);

  const userDetails = {
    watchlist: getRandomBool(),
    ['already_watched']: getRandomBool(),
    favorite: getRandomBool(),
  };

  if (userDetails.alreadyWatched) {
    userDetails['watching_date'] = createDate(0, 10000);
  }

  return {
    id,
    ['film_info']: {
      title,
      ['alternative_title']: title,
      ['total_rating']: getRandomFixedPoint(Rating.MIN, Rating.MAX, Rating.PRECISION),
      poster: getRandomPoster(),
      ['age_rating']: getOneRandomArrayElement(AGE_RATINGS),
      director: getOneRandomArrayElement(NAMES),
      writers: getRandomArrayElements(NAMES, getRandomInt(Writers.MIN, Writers.MAX)),
      actors: getRandomArrayElements(NAMES, getRandomInt(Actors.MIN, Actors.MAX)),
      release: {
        date: createDate(),
        ['release_country']: getOneRandomArrayElement(COUNTRIES),
      },
      runtime: getRandomInt(Runtime.MIN, Runtime.MAX),
      genre: getRandomArrayElements(GENRES, getRandomInt(GenresCount.MIN, GenresCount.MAX)),
      description: getRandomText(),
    },
    ['user_details']: userDetails,
    comments: comments.map((comment) => comment.id)
  };
};


const createComments = (commentIds, isLocal = false) => (
  commentIds.map((commentId) => createOneComment(commentId, isLocal))
);


const createCommentIds = (filmCount, maxCommentsPerFilm) => {
  let currentId = 1;
  const ids = [];

  for (let i = 0; i < filmCount; ++i) {
    ids.push([]);
    const commentsCount = getRandomInt(0, maxCommentsPerFilm);

    for (let j = 0; j < commentsCount; ++j) {
      ids[i].push(currentId);
      currentId += 1;
    }
  }

  return ids;
};


const createFilms = (count) => {
  const comments = createCommentIds(count, MAX_COMMENTS_PER_FILM);

  const films = Array.from(
    { length: count },
    (value, index) => createOneFilm(index + 1, comments[index])
  );

  return films;
};


const createFilters = (films) => {
  const filters = {
    watchlist: 0,
    history: 0,
    favorites: 0,
  };

  for (const film of films) {
    filters.watchlist += Number(film['user_details'].watchlist);
    filters.history += Number(film['user_details']['already_watched']);
    filters.favorites += Number(film['user_details'].favorite);
  }

  return filters;
};


export { createComments, createFilms, createFilters };
