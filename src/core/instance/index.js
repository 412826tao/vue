import { initMixin } from './init'
import {initState, stateMixin} from './state'
import {initRender, renderMixin} from './render'
import {eventsMixin, initEvents} from './events'
import {callHook, initLifecycle, lifecycleMixin} from './lifecycle'
import { warn } from '../util/index'
import {initInjections, initProvide} from "./inject";

// Vue构造函数声明处
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化
  // 在初始化里做了哪些操作

  // 1、合并options

  // initLifecycle(vm)
  // 2、定义vm.$parent
  //   定义vm.$root
  //   定义vm.$children
  //   定义vm.$refs

  // initEvents(vm)
  // 3、事件监听

  // initRender(vm)
  // 4、定义vm.$slots
  //   定义vm.$scopedSlots
  //   定义vm.$createElement

  // callHook(vm, 'beforeCreate')  声明周期调用的统一方法是callHook，这个方法
  // 5、去派发注册事件，所以在beforeCreate中，是可以访问到上面2、3、4、三个内容的

  // initInjections(vm) // resolve injections before data/props
  // 6、

  // initState(vm)
  // 7、核心数据初始化
  //    初始化props
  //    初始化data
  //    初始化method
  //    初始化computed
  //    初始化watch

  // initProvide(vm) // resolve provide after data/props
  // 8、
  // 为什么 Injections 会在Provide 之前去注册？
  // 因为继承问题，Inject可以拿到之前的祖辈的，之后在进行分发下去，
  // 这样，Provide就可以拿到祖辈传过来了，以及在state里面注册的数据

  // callHook(vm, 'created')
  // 9、
  // 所有数据相关的，都在beforCreate和created之间，上面三个内容，才会将数据变成响应式。
  this._init(options)
}

// 混入，Vue原型上定义了_init方法
initMixin(Vue)
// 状态, Vu原型上定义了$data、$props、 $set、$delete、$watch、
stateMixin(Vue)
// 事件
eventsMixin(Vue)
// 生命周期，Vue原型上定义了_update、$forceUpdate、$destory、
lifecycleMixin(Vue)
// 渲染
renderMixin(Vue)

export default Vue
