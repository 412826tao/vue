
// 真正创建节点，传入虚拟节点，将虚拟节点创建为真实DOM，插入到pivot之前
// 第一步：创建元素
// 第二步：创建元素的内部
//       分2类:1、节点有文本无chidlren，设置innerText
//            2、节点无文本有children，循环递归创建子节点
// 最后一步：将元素追加到虚拟DOM对应的真实DOM上（上树）

export default function createElement(vnode) {
  let domNode = document.createElement(vnode.sel)
  // 有节点还有文本
  if (vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
    // 它内部是文本
    domNode.innerText = vnode.text
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 它内部是子节点，递归创建子节点
    for (let i = 0; i < vnode.children.length; i++) {
      let ch = vnode.children[i]
      // 一旦调用createElement，意味着，创建除了DOM节点，它的elm指向了创建的DOM，还没有上树，是一个孤儿节点
      let chDOM = createElement(ch)
      // 上树
      domNode.appendChild(chDOM)
    }
  }
  // 补充elm属性，将虚拟节点变成真实节点，方便上树
  vnode.elm = domNode
  // 返回新节点的真实DOM
  return vnode.elm
}
