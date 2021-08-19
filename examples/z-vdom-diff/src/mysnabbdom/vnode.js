/*
* 虚拟节点本质是一个JS对象
* sel:选择器
* data: prop、style、key等
* children：子节点数组
* text:文本节点
* elm:真实DOM
* */
export default function (sel, data, children, text, elm) {
  const key = data.key
  return { sel, data, children, text, elm, key }
}
