// 各种缓动算法
const tween = {
  linear(t, b, c, d) {
    return c * (t / d) + b;
  },
  easeIn(t, b, c, d) {
    const t1 = t / d;
    return c * t1 ** 2 + b;
  },
  strongEaseIn(t, b, c, d) {
    const t1 = t / d;
    return c * t1 ** 3 + b;
  },
  strongEaseOut(t, b, c, d) {
    const t1 = t / d;
    return c * (t1 ** 3 + 1) + b;
  },
  sineaseIn(t, b, c, d) {
    return c * (1 - Math.cos((t / d) * (Math.PI / 2))) + b;
  },
  sineaseOut(t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  },
};
// 定义动画类
const Animate = function (dom) {
  this.dom = dom;
  this.startTime = 0;
  this.startPos = 0;
  this.endPos = 0;
  this.propertyName = null;
  this.easing = null;
  this.duration = null;
};
Animate.prototype.start = function (propertyName, endPos, duration, easing) {
  this.startTime = +new Date(); // 动画开启时间
  this.startPos = this.dom.getBoundingClientRect()[propertyName]; // 动画开始时的位置/初始状态
  this.propertyName = propertyName; // dom结点需要被改变的CSS属性名
  this.endPos = endPos;// dom结点的目标位置/目标状态
  this.duration = duration; // 动画持续时间
  this.easing = tween[easing]; // 动画缓动算法

  const self = this;
  // 启动定时器，开始执行动画
  const timeId = setInterval(() => {
    // 如果动画已结束，则清除定时器
    if (self.step() === false) {
      clearInterval(timeId);
    }
  }, 1000 / 60);
};
// 动画每一帧要做的事情
Animate.prototype.step = function () {
  const t = +new Date();
  // 动画已结束
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos); // 更改CSS的属性值
    return;
  }
  // 计算最新的属性值
  const pos = this.easing(
    t - this.startTime, // 持续时间
    this.startPos, // 开始位置
    this.endPos - this.startPos, // 目标位置
    this.duration, // 持续时间
  );
  this.update(pos); // 更改CSS的属性值
};
// 更新属性值的具体方法
Animate.prototype.update = function (pos) {
  this.dom.style[this.propertyName] = `${pos}px`;
};

export default Animate;
