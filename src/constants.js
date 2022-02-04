const FILMS_COUNT_PER_STEP = 5;
const BAR_HEIGHT = 50;


const FilmsFilterType = {
  NOTHING: 'nothing',
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};


const FilmsListExtraType = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
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


const Api = {
  AUTHORIZATION_TOKEN: 'adg7723bclm',
  END_POINT: 'https://16.ecmascript.pages.academy/cinemaddict',
};


const StatisticsInterval = {
  ALL_TIME: 'all time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const ChartColors = {
  BACKGROUND_COLOR: '#ffe800',
  HOVER_BACKGROUND_COLOR: '#ffe800',
  DATALABELS_COLORS: '#ffffff',
  FONT_COLOR: '#ffffff',
};


export {
  FILMS_COUNT_PER_STEP,
  FilmsFilterType,
  FilmsListExtraType,
  UserAction,
  NavigationItemsType,
  UpdateType,
  FilmSortType,
  Api,
  BAR_HEIGHT,
  StatisticsInterval,
  ChartColors
};
