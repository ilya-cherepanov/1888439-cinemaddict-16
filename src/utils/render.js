import AbstractView from '../view/abstract-view.js';


const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


const render = (container, element, place) => {
  container = container instanceof AbstractView ? container.element : container;
  element = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};


const replace = (oldElement, newElement) => {
  newElement = newElement instanceof AbstractView ? newElement.element : newElement;
  oldElement = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldElement.parentElement;
  parent.replaceChild(newElement, oldElement);
};


export { RenderPosition, render, replace };
