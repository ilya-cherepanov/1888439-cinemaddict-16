import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from '../smart-view.js';
import { createStatisticsTemplate } from './statistics-view.tmpl.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';


dayjs.extend(isSameOrAfter);


const StatisticsInterval = {
  ALL_TIME: 'all time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const countGenres = (films) => {
  const genres = {};

  for (const film of films) {
    for (const genre of film.filmInfo.genre) {
      if (!genres.hasOwnProperty(genre)) {
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
    (film) => film.userDetails.alreadyWatched && timeFilter(film)
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

const BAR_HEIGHT = 50;

export default class StatisticsView extends SmartView {
  constructor(films) {
    super();

    this._state = {
      films,
      statisticsInterval: StatisticsInterval.ALL_TIME,
      watchedFilms: filterByTimeInterval(films, StatisticsInterval.ALL_TIME),
    };

    this._state.allWatchedFilmsCount = this._state.watchedFilms.length;
    this._state.watchedGenres = countGenres(this._state.watchedFilms);
    this._state.totalDuration = getTotalDuration(this._state.watchedFilms);
    this._state.topGenre = getTopGenre(this._state.watchedGenres);

    this.#setChangeFilterHandler();
    if (this._state.watchedFilms.length > 0) {
      this.#setChart();
    }
  }

  get template() {
    const {
      watchedFilms,
      totalDuration,
      topGenre,
      allWatchedFilmsCount
    } = this._state;

    return createStatisticsTemplate(
      watchedFilms.length,
      totalDuration,
      topGenre,
      this.filters,
      allWatchedFilmsCount
    );
  }

  get filters() {
    return [
      {
        id: 'statistic-all-time',
        value: 'all-time',
        checked: this._state.statisticsInterval === StatisticsInterval.ALL_TIME,
        label: 'All time',
      },
      {
        id: 'statistic-today',
        value: 'today',
        checked: this._state.statisticsInterval === StatisticsInterval.TODAY,
        label: 'Today'
      },
      {
        id: 'statistic-week',
        value: 'week',
        checked: this._state.statisticsInterval === StatisticsInterval.WEEK,
        label: 'Week'
      },
      {
        id: 'statistic-month',
        value: 'month',
        checked: this._state.statisticsInterval === StatisticsInterval.MONTH,
        label: 'Month'
      },
      {
        id: 'statistic-year',
        value: 'year',
        checked: this._state.statisticsInterval === StatisticsInterval.YEAR,
        label: 'Year'
      },
    ];
  }

  #setChangeFilterHandler = () => {
    const filterRadios = this.element.querySelectorAll('.statistic__filters-input');

    filterRadios.forEach((filterRadio) => filterRadio.addEventListener('input', this.#handleChangeFilter));
  }

  restoreHandlers() {
    this.#setChangeFilterHandler();
  }

  updateElements() {
    super.updateElements();

    if (this._state.watchedFilms.length > 0) {
      this.#setChart();
    }
  }

  #handleChangeFilter = ({ target }) => {
    let stateUpdate = null;

    switch (target.value) {
      case 'all-time':
        stateUpdate = {
          statisticsInterval: StatisticsInterval.ALL_TIME,
        };
        break;
      case 'today':
        stateUpdate = {
          statisticsInterval: StatisticsInterval.TODAY,
        };
        break;
      case 'week':
        stateUpdate = {
          statisticsInterval: StatisticsInterval.WEEK,
        };
        break;
      case 'month':
        stateUpdate = {
          statisticsInterval: StatisticsInterval.MONTH,
        };
        break;
      case 'year':
        stateUpdate = {
          statisticsInterval: StatisticsInterval.YEAR,
        };
        break;
    }

    stateUpdate.watchedFilms = filterByTimeInterval(this._state.films, stateUpdate.statisticsInterval);
    stateUpdate.watchedGenres = countGenres(stateUpdate.watchedFilms);
    stateUpdate.totalDuration = getTotalDuration(stateUpdate.watchedFilms);
    stateUpdate.topGenre = getTopGenre(stateUpdate.watchedGenres);

    this.updateState(stateUpdate, false);
  }

  #setChart = () => {
    const sortedGenres = sortGenres(this._state.watchedGenres);
    const labels = sortedGenres.map((genre) => genre[0]);
    const data = sortedGenres.map((genre) => genre[1]);

    const statisticCanvas = this.element.querySelector('.statistic__chart');
    statisticCanvas.height = BAR_HEIGHT * labels.length;


    const statisticCtx = statisticCanvas.getContext('2d');

    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}
