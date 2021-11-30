const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];


const getRandomInt = (from, to) => {
  if (from > to) {
    [to, from] = [from, to];
  } else if (from === to) {
    return from;
  }

  return Math.floor(Math.random() * (to - from + 1)) + from;
};


const getRandomFixedPoint = (from, to, digits) => {
  const significantFrom = Math.floor(from * (10 ** digits));
  const significantTo = Math.floor(to * (10 ** digits));

  return getRandomInt(significantFrom, significantTo) / (10 ** digits);
};


const getRandomArrayElements = (arr, elementsNumber) => {
  if (elementsNumber >= arr.length) {
    return [...arr];
  } else if (elementsNumber <= 0) {
    return [];
  }

  const availableFeatures = [...arr];

  return Array.from(
    { length: elementsNumber },
    () => availableFeatures.splice(getRandomInt(0, availableFeatures.length - 1), 1)[0],
  );
};


const getOneRandomArrayElement = (array) => array[getRandomInt(0, array.length - 1)];


const getRandomBool = () => Math.random() >= 0.5;


const getRandomText = (minSentences = 1, maxSentences = 5) => (
  getRandomArrayElements(LOREM_SENTENCES, getRandomInt(minSentences, maxSentences)).join(' ')
);


export {
  getRandomInt,
  getRandomFixedPoint,
  getRandomArrayElements,
  getOneRandomArrayElement,
  getRandomBool,
  getRandomText
};
