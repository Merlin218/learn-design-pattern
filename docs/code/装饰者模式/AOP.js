/* eslint-disable no-extend-native */
Function.prototype.before = function (beforeFn) {
  const self = this; // 保存原函数的引用
  return function (...args) { // 返回包含了原函数和新函数的“代理”函数
    beforeFn.apply(this, args); // 执行新函数，且保证this不会被劫持
    return self.apply(this, args); // 执行原函数并返回结果
  };
};

Function.prototype.after = function (afterFn) {
  const self = this;
  return function (...args) {
    const ret = self.apply(this, args);
    afterFn.apply(this, args);
    return ret;
  };
};

// 不污染原型
const before = function (fn, beforeFn) {
  return function (...args) {
    beforeFn.apply(this, args);
    return fn.apply(this, args);
  };
};

const after = function (fn, afterFn) {
  return function (...args) {
    const ret = fn.apply(this, args);
    afterFn.apply(this, args);
    return ret;
  };
};

let fn = function () {
  console.log('fn');
};

fn = before(fn, () => {
  console.log('before');
});

fn = after(fn, () => {
  console.log('after');
});

fn();
