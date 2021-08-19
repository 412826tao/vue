
import vnode from './vnode'
import createElement from './createElement'
import patchVnode from './patchVnode'


// 上树：传入虚拟老节点，虚拟新节点
// 第一步：判断第一个节点是虚拟节点还是虚拟节点（第一次使用pacth函数，第一个参数是真实DOM），是真实DOM的话要将真实DOM转换成虚拟DOM
// 第二步：判断新旧节点是否是同一个节点
//       1、是同一节点（key相同，sel相同）：精细化比较
//       2、不是统一节点：暴力删除旧节点，插入新节点（删除过程：创建新节点、插入旧节点之前、删除旧节点）

export default function (oldVnode, newVnode) {
    // 1.判断第一个参数是虚拟节点还是真实DOM节点
  if (oldVnode.sel === '' || oldVnode.sel === undefined) {
    // 传入的参数是真实DOM，包装成虚拟节点
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
  }
  // 判断新旧节点是同一个节点
  if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    // 同一个节点
    patchVnode(oldVnode, newVnode)

  } else {
    // 不是同一个节点，暴力删除旧节点，插入新节点
    let newVnodeElm = createElement(newVnode)
    // 插入老节点之前
    if (oldVnode.elm.parentNode && newVnodeElm) {
      oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    }
    // 删除老节点
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}
