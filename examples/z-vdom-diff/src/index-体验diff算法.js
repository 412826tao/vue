import { init } from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import { h } from 'snabbdom/h'


// 创建patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule])


const vnode1 = h('ul', {}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
])
const container = document.getElementById('container')
patch(container, vnode1)
const btn = document.getElementById('btn')
const vnode2 = h('ul', {}, [
  h('li', {key: 'E'}, 'E'),
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D')
])
btn.onclick = function () {
  patch(vnode1, vnode2)
}

