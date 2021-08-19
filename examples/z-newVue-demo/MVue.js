
const compileUtil = {
  getVal (expr, vm) {
    return expr.split('.').reduce((data, currentVal) => {
      return data[currentVal];
    }, vm.$data);
  },

  setVal (expr, vm, inputVal) {
    expr.split('.').reduce((data, currentVal) => {
      data[currentVal] = inputVal;
    }, vm.$data);
  },

  getContentVal (expr, vm) {
    return expr.replace(/\{\{(.+?)\}\}/, (...args) => {
      return this.getVal(args[1], vm)
    })
  },
  // expr value
  text (node, expr, vm) {
    // expr 2种 v-text:msg   v-text:person.name
    let value;
    // {{}}
    if (expr.indexOf('{{') !== -1) {
      // {{person.name}}---{{person.age}}
      value = expr.replace(/\{\{(.+?)\}\}/, (...args) => {
        console.log(args); // args ['{{person.name}}', 'person.name', 0, '{{person.name}}--{{person.age}}']
        // 绑定观察者，将来数据发生变化，
        new Watcher(vm, args[1], (newVal) => {
          this.updater.textUpdater(node, this.getContentVal(expr, vm));
        });

        return this.getVal(args[1], vm)
      })
    } else {
      // v-text
      value = this.getVal(expr, vm);
    }
    this.updater.textUpdater(node, value);
  },
  html (node, expr, vm) {
    const value = this.getVal(expr, vm);
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal);
    });
    this.updater.htmlUpdater(node, value);
  },
  model (node, expr, vm) {
    const value = this.getVal(expr, vm);
    // 绑定更新数据， 数据-》视图
    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal);
    });
    // 视图-》数据
    node.addEventListener('input', e => {
      this.setVal(expr, vm, e.target.value);
    })
    this.updater.modelUpdater(node, value);
  },
  on(node, expr, vm, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[expr];
    node.addEventListener(eventName, fn.bind(vm), false);
  },
  bind(node, expr, vm, eventName) {
    // 自己实现
    // let fn = vm.$options.methods && vm.$options.methods[expr];
    // node.addEventListener(eventName, fn.bind(vm), false);
  },

  updater: {
    textUpdater (node, value) {
      node.textContent = value;
    },
    htmlUpdater (node, value) {
      node.innerHtml = value;
    },
    modelUpdater (node, value) {
      node.value = value;
    }
  }
}

class Compile {
  constructor (el, vm) {
    this.el = this.isElementNode(el) ? el :  document.querySelector(el);
    this.vm = vm;
    // 1.获取文档碎片对象，放入内存减少页面的回流和重绘
    const fragment = this.node2Fragement(this.el)
    // 2、编译模板
    this.compile(fragment)
    // 3、追加子元素到根元素
    this.el.appendChild(fragment);

  }
  compile (fragment) {
    // 1、获取子节点
    const childNodes = fragment.childNodes;
    Array.prototype.slice.call(childNodes).forEach(child => {
      if (this.isElementNode(child)) {
        // 是元素节点
        this.compileElement(child)
      } else {
        // 文本节点
        this.compileText(child)
      }
      // 循环编译子节点
      if (child.childNodes && child.childNodes.length > 0) {
        this.compile(child)
      }
    })
  }

  compileElement (node) {
      const attributes =  node.attributes;
    Array.prototype.slice.call(attributes).forEach(attr => {
      const {name, value} = attr;
      if (this.isDirective(name)) {
        // 是一个指令, v-text,v-html,v-model,v-on:click,
        const [, directive] = name.split('-'); // text,html,model,on:click
        const [dirName, eventName] = directive.split(':');//text,html,model,click
        //  更新数据，数据驱动视图
        compileUtil[dirName](node, value, this.vm, eventName);

        // 删除有指令标签上的属性
        node.removeAttribute('v-' + directive);
      } else if (this.isEventName(name)) { // @click="handleClick"
        let [, eventName] = name.split('@');
        compileUtil['on'](node, value, this.vm, eventName)
      }
    })
  }

  compileText (node) {
    const content = node.textContent;
    if (/\{\{(.+?)\}\}/.test(content)) {
      compileUtil['text'](node, content, this.vm)
    }

  }
  isEventName (attrName) {
    return attrName.startsWith('@');
  }

  isDirective (attrName) {
    return attrName.startsWith('v-');
  }

  node2Fragement (el) { // el根元素，获取它所有子元素的碎片元素
    // 创建文档碎片对象
    const f = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      f.appendChild(firstChild)
    }
    return f;

  }

  isElementNode (node) {
    return node.nodeType === 1;
  }
}

class MVue {
    constructor  (options) {
      this.$el = options.el;
      this.$options = options;
      this.$data = options.data;
      if (this.$el) {
        // 1、实现一个数据的观察者Observer
        new Observer(this.$data)
        // 2、实现一个数据的解析器
        new Compile(this.$el, this)
        // 代理
        this.proxyData(this.$data);
      }
    }
    proxyData (data) {
      for (let key in data) {
        Object.defineProperty(this, key, {
          get: () => {
            return data[key];
          },
          set: (newVal) => {
            data[key] = newVal;
          }
        })
      }
    }
}
