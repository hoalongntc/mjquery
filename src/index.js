/* global window document Node HTMLElement XMLHttpRequest ActiveXObject */

const isNode = o => (
  typeof Node === 'object' ? o instanceof Node :
    o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
);

const isElement = o => (
  typeof HTMLElement === 'object' ? o instanceof HTMLElement : // DOM2
    o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
);

const show = (el) => {
  el.style.display = '';
  return el;
};

const hide = (el) => {
  el.style.display = 'none';
  return el;
};

const addClass = (el, className) => {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ` ${className}`;
  }
  return el;
};

const removeClass = (el, className) => {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
  }
  return el;
};

const hasClass = (el, className) => {
  if (el.classList) {
    el.classList.contains(className);
  } else {
    new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
  }
};

const toggleClass = (el, className) => {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    const classes = el.className.split(' ');
    let existingIndex = -1;
    for (let i = classes.length - 1; i >= 0; i -= 1) {
      if (classes[i] === className) {
        existingIndex = i;
      }
    }

    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1);
    } else {
      classes.push(className);
    }

    el.className = classes.join(' ');
  }
  return el;
};

const css = (el, attr, val) => {
  if (!attr) return el;
  const cssClass = attr
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase()))
    .replace(/[\s-]+/g, '');

  if (Object.prototype.hasOwnProperty.call(el.style, cssClass)) {
    el.style[cssClass] = val || '';
  }
  return el;
};

// const remove = (el) => {
//   el.parentNode.removeChild(el);
// };

const ready = (el, fn) => {
  if (!el) return;
  if (document.readyState !== 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', () => {
      if (document.readyState !== 'loading') {
        fn();
      }
    });
  }
};

const addEventListener = (el, eventName, handler) => {
  if (!el) return;
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent(`on${eventName}`, () => {
      handler.call(el);
    });
  }
};

const click = (el, handler) => {
  if (!el) return undefined;
  if (typeof handler === 'undefined') {
    el.click();
    return el;
  }

  return addEventListener(el, 'click', handler);
};

const attr = (el, key, val) => {
  if (!el) return undefined;
  if (val) {
    el.setAttribute(key, val);
    return el;
  }
  return el.getAttribute(key);
};

const removeAttr = (el, attrName) => {
  if (!el) return undefined;
  el.removeAttribute(attrName);
  return el;
};

const html = (el, val) => {
  if (!el) return undefined;
  if (val) {
    el.innerHTML = val;
    return el;
  }
  return el.innerHTML;
};

const text = (el, val) => {
  if (!el) return undefined;
  if (val) {
    if (el.textContent !== undefined) {
      el.textContent = val;
    } else {
      el.innerText = val;
    }
    return el;
  }
  return el.textContent || el.innerText;
};

const prop = (el, propName, value) => {
  if (!el || !propName || !Object.prototype.hasAttributes.call(el, propName)) return undefined;
  if (typeof value !== 'undefined') {
    el[propName] = value;
    return el;
  }
  return el[propName];
};

const val = (el, value) => {
  if (!el) return undefined;
  if (typeof value !== 'undefined') {
    el.value = value;
    return el;
  }
  return el.value;
};

const submit = (el) => {
  if (!el) return undefined;
  if (typeof el.submit === 'function') {
    el.submit();
  }
  return el;
};

const xhr = () => {
  if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest();
  }
  const versions = [
    'MSXML2.XmlHttp.6.0',
    'MSXML2.XmlHttp.5.0',
    'MSXML2.XmlHttp.4.0',
    'MSXML2.XmlHttp.3.0',
    'MSXML2.XmlHttp.2.0',
    'Microsoft.XmlHttp',
  ];

  let xRequest;
  for (let i = 0; i < versions.length; i += 1) {
    try {
      xRequest = new ActiveXObject(versions[i]);
      break;
    } catch (e) { /* No empty */ }
  }
  return xRequest;
};

const param = obj => Object.keys(obj)
  .map(keyName => `${encodeURIComponent(keyName)}=${encodeURIComponent(obj[keyName])}`)
  .join('&');

function ajax(url, obj) {
  if (typeof url === 'object') {
    obj = url;
    url = obj.url;
  }

  const request = xhr();
  request.open(obj.method, url, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 400) {
        if (typeof obj.success === 'function') {
          obj.success.apply(this, [request]);
        }
        return;
      }
      if (typeof obj.error === 'function') {
        obj.error.apply(this, [request]);
      }
    }
  };

  if (obj.data) {
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(typeof obj.data === 'string' ? obj.data : param(obj.data));
  } else {
    request.send();
  }
  return request;
}

const clone = obj => JSON.parse(JSON.stringify(obj));

function $(el) {
  el = el || '';
  this.selector = '';

  if (typeof el === 'string') {
    this.selector = el;
  } else if (el.constructor.name === '$') {
    this.selector = el.selector;
  } else if (['NodeList', 'HTMLCollection'].indexOf(el.constructor.name) > -1) {
    this.elements = Array.prototype.slice.call(el);
  } else if (isNode(el) || isElement(el)) {
    this.elements = [el];
  }

  this.elements = this.selector ? document.querySelectorAll(this.selector) : (this.elements || []);
  this.elements = this.elements || [];
  this.length = this.elements.length;

  return this;
}

const utilFuns = {
  ajax,
  param,
  clone,
};
Object.keys(utilFuns).forEach(fName => ($[fName] = utilFuns[fName]));

const collectionFuncs = {
  show,
  hide,
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  css,
  on: addEventListener,
};
Object.keys(collectionFuncs).forEach((fName) => {
  $.prototype[fName] = function (...args) {
    this.elements = Array.prototype.map
      .call(this.elements, el => collectionFuncs[fName].apply(el, [el].concat(args)));
    return this;
  };
});

const singleFuns = {
  attr,
  removeAttr,
  html,
  text,
  val,
  prop,
  submit,
  ready,
  click,
};
Object.keys(singleFuns).forEach((fName) => {
  $.prototype[fName] = function (...args) {
    const el = this.elements[0];
    return singleFuns[fName].apply(el, [el].concat(args));
  };
});

export default el => new $(el);
