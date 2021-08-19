
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 先把旧值保存起来
    this.oldVal = this.getOldVal();
  }

  getOldVal () {
    Dep.target = this; // 暂存Watcher对象
    const oldVal = compileUtil.getVal(this.expr, this.vm);
    Dep.target = null;
    return oldVal;
  }

  update () {
    const newVal = compileUtil.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      // 把新值callback出去
      this.cb(newVal);
    }
  }
}



class Dep {
  constructor () {
    this.subs = [];
  }
  // 收集观察者
  addSub (watcher) {
    this.subs.push(watcher);
  }
  // 通知观察者去更新
  notify () {
    this.subs.forEach(w => w.update());
  }
}



class Observer {
  constructor (data) {
    this.observe(data)
  }
  observe (data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.defineReactive(data, key, data[key])
      })
    }
  }

  // 劫持数据
  defineReactive (obj, key, value) {
    // 递归遍历
    this.observe(value);
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get: () => {
        // 订阅者数据发生变化时，通知订阅者
        Dep.target && dep.addSub(Dep.target);
        return value
      },
      set: (newVal) => { // 箭头函数不改变this指向，
        // 监听新值
        this.observe(newVal);
        if (newVal !== value) {
          value = newVal;
        }
        // 通知变化
        dep.notify();
      }
    })
  }
}
