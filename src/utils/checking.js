const KeyCode = {
  ESC: 27,
};


const isEscKey = (evt) => evt.keyCode === KeyCode.ESC;


const isCtrlEnter = (evt) => evt.code === 'Enter' && (evt.ctrlKey || evt.metaKey);


export { isEscKey, isCtrlEnter };
