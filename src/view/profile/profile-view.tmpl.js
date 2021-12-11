const UserRanks = {
  NOVICE: {
    RANK: 'Novice',
    MIN_FILMS: 1,
    MAX_FILMS: 10,
  },
  FAN: {
    RANK: 'Fan',
    MIN_FILMS: 11,
    MAX_FILMS: 20,
  },
  MOVIE_BUFF: {
    RANK: 'Movie Buff',
    MIN_FILMS: 21,
    MAX_FILMS: Infinity,
  },
};


const getUserRankName = (watchedFilmsCount) => {
  for (const userRank of Object.values(UserRanks)) {
    if (watchedFilmsCount >= userRank.MIN_FILMS && watchedFilmsCount <= userRank.MAX_FILMS) {
      return userRank.RANK;
    }
  }
};


const getUserRank = (films) => {
  const watchedFilmsCount = films.reduce((count, film) => count + Number(film.userDetails.alreadyWatched), 0);

  if (watchedFilmsCount === 0) {
    return '';
  }

  return `<p class="profile__rating">${getUserRankName(watchedFilmsCount)}</p>`;
};


const createProfileTemplate = (films) => (
  `<section class="header__profile profile">
    ${getUserRank(films)}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);


export { createProfileTemplate };
