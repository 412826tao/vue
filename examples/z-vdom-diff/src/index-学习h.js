
import { init } from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import { h } from 'snabbdom/h'


// 创建patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule])
// 创建虚拟节点
var myvnode1 = h('a', {
  props: {
    href: 'https://www.baidu.com',
    target: '_blank'
  }
  }, '跳转')

const myvnode2 = h('div', '我是一个节点')
const myvnode3 = h('ul', {}, [
  h('li', "香蕉"),
  h('li', "苹果"),
  h('li', {}, [
    h('div', '青椒'),
    h('div', '茄子'),
  ]),
  h('li', h('span', "草莓")),
])
console.log(myvnode3);
// 让虚拟节点上树
const container = document.getElementById('container')
patch(container, myvnode3)

