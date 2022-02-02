import { getUserRankName } from '../../utils/format.js';


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
