const KeyCode = {
  ESC: 27,
};


const isEscKey = (evt) => evt.keyCode === KeyCode.ESC;


const isListEnded = (list, step = 0, perStep = 0) => list.length <= step * perStep;


export { isEscKey, isListEnded };
