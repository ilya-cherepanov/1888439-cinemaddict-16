const FilmsFilterType = {
  NOTHING: 'nothing',
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};


const FilmsListExtraType = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented'
};


const Films = {
  COUNT: 23,
  COUNT_PER_STEP: 5,
};


const UserAction = {
  UPDATE_FILM: 'update film',
  REMOVE_COMMENT: 'remove comment',
  ADD_COMMENT: 'add comment',
};


const NavigationItemsType = {
  FILMS: 'films',
  STATISTICS: 'statistics',
};


const UpdateType = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
  POPUP: 'popup',
  INIT: 'init',
};


const FilmSortType = {
  BY_DEFAULT: 'by default',
  BY_DATE: 'by date',
  BY_RATING: 'by rating',
};


export {
  Films,
  FilmsFilterType,
  FilmsListExtraType,
  UserAction,
  NavigationItemsType,
  UpdateType,
  FilmSortType,
};
