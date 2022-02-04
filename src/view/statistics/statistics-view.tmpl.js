import { getUserRankName } from '../../utils/format.js';

const MINUTES_IN_HOUR = 60;

const getTotalDuration = (totalDuration) => {
  const hours = Math.floor(totalDuration / MINUTES_IN_HOUR);
  const minutes = totalDuration % MINUTES_IN_HOUR;

  return `<p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>`;
};

const getStatisticRadios = (filters) => {
  let radioElements = '';

  for (const filter of filters) {
    radioElements += `
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="${filter.id}" value="${filter.value}" ${filter.checked ? 'checked' : ''}>
      <label for="${filter.id}" class="statistic__filters-label">${filter.label}</label>`;
  }

  return radioElements;
};

const getStatisticChart = (watchedCount) => {
  if (watchedCount <= 0) {
    return '';
  }

  return `
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>`;
};

const getTopGenre = (watchedCount, topGenre) => {
  if (watchedCount <= 0) {
    return '';
  }

  return `
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>`;
};

const getStatisticRank = (allWatchedCount) => {
  if (allWatchedCount === 0) {
    return '';
  }

  return `
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRankName(allWatchedCount)}</span>
    </p>`;
};

const createStatisticsTemplate = (watchedCount, totalDuration, topGenre, filters, allWatchedCount) => (
  `<section class="statistic">
    ${getStatisticRank(allWatchedCount)}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${getStatisticRadios(filters)}

    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${getTotalDuration(totalDuration)}
      </li>
      ${getTopGenre(watchedCount, topGenre)}
    </ul>

    ${getStatisticChart(watchedCount)}

  </section>`
);


export { createStatisticsTemplate };
