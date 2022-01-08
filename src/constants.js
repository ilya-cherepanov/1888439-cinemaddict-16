const FilmsFilterType = {
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
  ...FilmsFilterType,
  STATS: 'stats',
};


export {
  Films,
  FilmsFilterType,
  FilmsListExtraType,
  UserAction,
  NavigationItemsType
};
