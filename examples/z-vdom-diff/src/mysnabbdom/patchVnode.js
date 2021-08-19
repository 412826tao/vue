import createElement from "./createElement";
import updateChildren from './updateChildren';

// 第一步：判断新旧节点在内存中是不是同一个对象
//       1、是：什么也不做
//       1、否：进行第二步
// 第二步：判断新节点有没有text属性
//       2、有：newVnode和oldVnode的text是否相同
//              2-1、相同：什么也不做
//              2-1、不同：把elm中的innerText改成newVnode的text，即使oldVnode有children无text也无碍。
//       2、没有：（意味着newVnode有children）判断oldVnode有没有children
//              2-2、没有：直接清空oldVnode的text，把newVnode的children添加到DOM中
//              2-2、有：（表示新旧节点都有children，就要进行最复杂的diff算法了，也就是核心updateChildren的内容）
export default function (oldVnode, newVnode) {
  // 判断新旧vnode是否是同一个对象
  if (newVnode === oldVnode) return
  // 判断vnode有没有text属性
  if (newVnode.text !== '' && (newVnode.children === undefined || newVnode.children.length === 0)) {
    // 新vnode有text属性
    if (newVnode.text !==  oldVnode.text) {
      // 新旧vnode的text不相同，将新vnode的text写入旧vnode的elm中
      oldVnode.elm.innerText = newVnode.text
    }
  } else {
    // 新vnode没有text属性，有children

    // 判断旧vnode有没有children
    if (oldVnode.children !==  undefined && oldVnode.children.length > 0) {
      // 旧vnode有children,新vnode也有children
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)

    } else {

      // 旧vnode有text，没有children，新vnode有chidren
      // 清空老节点内容
      oldVnode.elm.innerHtml = ''
      for (let i; i < newVnode.children.length; i++) {
        let dom = createElement(newVnode.children[i])
        oldVnode.elm.appendChild(dom)
      }

    }
  }
}
