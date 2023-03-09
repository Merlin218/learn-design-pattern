/* eslint-disable no-extend-native */
/* eslint-disable consistent-return */
const order500 = function (orderType, pay) {
  if (orderType === 1 && pay) {
    console.log('满500减100');
  } else {
    return 'nextSuccessor';
  }
};

const order200 = function (orderType, pay) {
  if (orderType === 2 && pay) {
    console.log('满200减50');
  } else {
    return 'nextSuccessor';
  }
};

const orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买');
  } else {
    console.log('库存不足');
  }
};

class Chain {
  constructor(fn) {
    this.fn = fn;
    this.successor = null;
  }

  setNextSuccessor(successor) {
    this.successor = successor;
    return successor;
  }

  passRequest(...args) {
    const ret = this.fn(...args);
    if (ret === 'nextSuccessor') {
      return this.successor && this.successor.passRequest(...args);
    }
    return ret;
  }

  next(...args) {
    return this.successor && this.successor.passRequest(...args);
  }
}

const chainOrder500 = new Chain(order500);
const chainOrder200 = new Chain(order200);
const chainOrderNormal = new Chain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(1, true, 500); // 满500减100
chainOrder500.passRequest(2, true, 500); // 满200减50
chainOrder500.passRequest(3, true, 500); // 普通购买
chainOrder500.passRequest(1, false, 0); // 库存不足

const order300 = function (orderType, pay) {
  if (orderType === 3 && pay) {
    console.log('满300减100');
  } else {
    return 'nextSuccessor';
  }
};

// 新增政策
const chainOrder300 = new Chain(order300);
chainOrder500.setNextSuccessor(chainOrder300);
chainOrder300.setNextSuccessor(chainOrderNormal);

// 异步职责链
const fn1 = new Chain(() => {
  console.log('fn1');
  return 'nextSuccessor';
});

const fn2 = new Chain(function () {
  console.log('fn2');
  const self = this;
  setTimeout(() => {
    self.next();
  }, 3000);
});

const fn3 = new Chain(() => {
  console.log('fn3');
});

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();

// AOP
Function.prototype.after = function (fn) {
  const self = this;
  return function (...args) {
    // 先执行本身
    const ret = self.apply(this, args);
    // 如果本身返回的是nextSuccessor，则执行fn，并返回结果
    if (ret === 'nextSuccessor') {
      return fn.apply(this, args);
    }
    // 否则返回结果
    return ret;
  };
};

const order = order500.after(order200).after(orderNormal);
order(1, true, 500); // 满500减100
order(2, true, 500); // 满200减50
order(1, false, 500); // 普通购买
