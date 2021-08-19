import h from './mysnabbdom/h.js'
import patch from './mysnabbdom/patch.js'

//  const vnode1 = h('h1', {}, '你好')
const vnode1 = h('ul', {}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
  h('li', {key: 'E'}, 'E'),
])
const container = document.getElementById('container')

patch(container, vnode1)

/*const vnode2 = h('ul', {}, [
  h('li', {key: 'E'}, 'E'),
  h('li', {key: 'D'}, 'D'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'A'}, 'A'),
])*/
const vnode2 = h('ul', {}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
  h('li', {key: 'E'}, 'E'),
  h('li', {key: 'F'}, 'F'),
  h('li', {key: 'G'}, 'G'),
])

const btn = document.getElementById('btn')
btn.onclick = function () {
  patch(vnode1, vnode2)
}
