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
  if (matchFunc(startEl)) {
    resultSet.push(startEl)
  }

  for (let i = 0; i < startEl.children.length; i++) {
    let resultado = traverseDomAndCollectElements(matchFunc, startEl.children[i])

    resultSet = [...resultSet, ...resultado]
  }

  // for (let i = 0; i < startEl.childNodes.length; i++) {
  //   let currentNode = startEl.childNodes[i];
  //   if (matchFunc(currentNode)) {
  //     resultSet.push(currentNode);
  //   }

  //   // Si el nodo actual tiene hijos, llama recursivamente a la función traverseDomAndCollectElements
  //   if (currentNode.childNodes.length > 0) {
  //     resultSet = resultSet.concat(traverseDomAndCollectElements(matchFunc, currentNode));
  //   }
  // }

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
  // for (let i = 0; i < selector.length; i++) { if (selector[i] === '.') return 'tag.class' }
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
    matchFunction = element => element.id === selector.slice(1);
    // matchFunction = element => `#${element.id}` === selector;
  } else if (selectorType === "class") {
    matchFunction = element => element.classList.contains(selector.slice(1));
    // matchFunction = element => element.classList.contains(selector.substring(1));
    // matchFunction = element => { for (let i = 0; i < element.classList.length; i++) { if ('.' + element.classList[i] === selector) return true } }
  } else if (selectorType === "tag.class") {
    matchFunction = element => {
      let [t, c] = selector.split(".")
      return matchFunctionMaker(t)(element) && matchFunctionMaker("." + c)(element)
    }
    // let t = selector.split(".")[0];
    // let c = selector.split(".")[1];
    // matchFunction = element => element.tagName.toLowerCase() === t && element.classList.contains(c);
  } else if (selectorType === "tag") {
    matchFunction = element => element.tagName.toLowerCase() === selector.toLowerCase();
  }

  // return matchFunction; /* Sin el EXTRA */

  //EXTRA
  // Nueva sección de código que maneja los selectores > y espacio en blanco
  if (selector.includes(">")) {
    let selectors = selector.split(">");
    matchFunction = (element, sel) => {
      let parent = element.parentElement;
      if (parent && matchFunctionMaker(selectors[1])(element) && matchFunctionMaker(selectors[0])(parent, sel)) {
        return true;
      } else { return false }
    };
  } else if (selector.includes(" ")) {
    let selectors = selector.split(" ");
    matchFunction = (element, sel) => {
      let ancestor = element.parentElement;
      while (ancestor) {
        if (matchFunctionMaker(selectors[1])(element) && matchFunctionMaker(selectors[0])(ancestor, sel)) {
          return true;
        }
        ancestor = ancestor.parentElement;
      }
      return false;
    };
  }

  return (element) => matchFunction(element, selector);
};

var $ = function (selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
