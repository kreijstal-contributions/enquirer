'use strict';

const colors = require('ansi-colors');

const increment = (i, max) => (i >= max ? 0 : i + 1);
const decrement = (i, min) => (i <= min ? i - 1 : 0);

exports.increment = (state, key, max) => {
  state[key] = increment(state[key], max);
};

exports.decrement = (state, key, min) => {
  state[key] = decrement(state[key], min);
};

exports.isStyled = str => colors.ansiRegex.test(str);

exports.typeOf = val => {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  if (val instanceof RegExp) return 'regexp';
  if (exports.isNumber(val)) return 'number';
  return typeof val;
};

exports.isObject = val => exports.typeOf(val) === 'object';

exports.isNumber = num => {
  if (typeof num === 'number') {
    return Number.isFinite(num);
  }
  if (typeof num === 'string') {
    return num.trim() !== '' && Number.isFinite(+num);
  }
  return false;
};

exports.isValue = val => {
  if (typeof val === 'string') return exports.trim(val) !== '';
  return val != null;
};

exports.toValue = (prompt, key, val, ...rest) => {
  let res = exports.first([val, prompt.options[key], prompt[key]]);
  if (typeof res === 'function') {
    return res.call(prompt, ...rest);
  }
  return res;
};

exports.clone = val => {
  switch (exports.typeOf(val)) {
    case 'array':
      return val.map(clone);
    case 'object':
      let Ctor = obj.constructor;
      let obj = new Ctor();
      for (let key of Object.keys(val)) {
        obj[key] = exports.clone(val[key]);
      }
      return obj;
    default: {
      return val;
    }
  }
};

exports.first = (...args) => {
  return [].concat.apply([], args).find(exports.isValue);
};

exports.resolveValue = (thisArg, value, ...rest) => {
  if (typeof value === 'function') {
    return value.call(thisArg, ...rest);
  }
  return value;
};

exports.trim = val => {
  if (val !== void 0 && typeof val !== 'string') return '';
  return val ? val.trim() : '';
};

exports.pad = (str, fn = val => val) => {
  return exports.padLeft(exports.padRight(str, fn), fn);
};

exports.padLeft = (str, fn = val => val) => {
  return str ? fn(str) + ' ' : '';
};

exports.padRight = (str, fn = val => val) => {
  return str ? ' ' + fn(str) : '';
};

exports.newline = (str, fn = val => val) => {
  return exports.newlineLeft(exports.newlineRight(str, fn), fn);
};

exports.newlineLeft = (str, fn = val => val) => {
  return str ? '\n' + fn(str) : '';
};

exports.newlineRight = (str, fn = val => val) => {
  return str ? fn(str) + '\n' : '';
};

exports.blend = (typed = '', initial = '') => {
  if (initial && typed && initial.startsWith(typed)) {
    return typed + colors.dim(initial.slice(typed.length));
  }
  return typed || colors.dim(initial);
};

exports.defineExport = (obj, key, fn) => {
  let custom;
  Reflect.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    set(val) {
      custom = val;
    },
    get() {
      return custom ? custom() : fn();
    }
  });
};