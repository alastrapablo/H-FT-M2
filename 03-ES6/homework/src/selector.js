var traverseDomAndCollectElements = function (matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") {
    startEl = document.body;
  }

  // recorre el árbol del DOM y recolecta elementos que matchien en resultSet
  // usa matchFunc para identificar elementos que matchien
  //? TU CÓDIGO AQUÍ

  // Itera sobre los nodos hijos del elemento actual y los pasa a la función matchFunc
  // Si matchFunc devuelve true, agrega el elemento al conjunto de resultados
  for (let i = 0; i < startEl.childNodes.length; i++) {
    let currentNode = startEl.childNodes[i];
    if (matchFunc(currentNode)) {
      resultSet.push(currentNode);
    }

    // Si el nodo actual tiene hijos, llama recursivamente a la función traverseDomAndCollectElements
    if (currentNode.childNodes.length > 0) {
      resultSet = resultSet.concat(traverseDomAndCollectElements(matchFunc, currentNode));
    }
  }
  return resultSet;
};

// Detecta y devuelve el tipo de selector
// devuelve uno de estos tipos: id, class, tag.class, tag

var selectorTypeMatcher = function (selector) {
  // tu código aquí
  if (!selector) { return false }
  if (selector.charAt(0) === '#') { return 'id' }
  if (selector.charAt(0) === '.') { return 'class' }
  if (selector.includes('.') && selector.charAt(0) !== '.') { return 'tag.class' }
  if (!selector.includes('.') && !selector.includes('#')) { return 'tag' }
};

// NOTA SOBRE LA FUNCIÓN MATCH
// recuerda, la función matchFunction devuelta toma un elemento como un
// parametro y devuelve true/false dependiendo si el elemento
// matchea el selector.

var matchFunctionMaker = function (selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;
  if (selectorType === "id") {
    matchFunction = (element) => element.id === selector.slice(1);

  } else if (selectorType === "class") {
    matchFunction = (element) => element.classList.contains(selector.slice(1));

  } else if (selectorType === "tag.class") {
    var tag = selector.split(".")[0];
    var className = selector.split(".")[1];
    matchFunction = (element) => element.tagName.toLowerCase() === tag && element.classList.contains(className);

  } else if (selectorType === "tag") {
    matchFunction = (element) => element.tagName.toLowerCase() === selector.toLowerCase();
  }

  return matchFunction;
};

var $ = function (selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
