import vnode from  './vnode'

//编写低配版的h函数，这个函数接受3个参数，缺一不可
// 调用形势必须是下面
// h('div', {}, '文字')
// h('div', {}, [])
// h('div', {}, h('span','文字'))
// 这里分2类，1、子节点是数组，2、子节点是对象（虚拟DOM）
export default function (sel, data, c) {
  // 检查参数的个数
  if (arguments.length !== 3)
    throw new Error('sorry,低配版，参数必须是3个')
  if (typeof c === 'string' || typeof c === 'number') {
    return  vnode(sel, data, undefined, c, undefined)
  } else if (Array.isArray(c)) {
    // 遍历c
    let children = []
    for (let i = 0; i < c.length; i++) {
      if (!(typeof c[i] === 'object'  && c[i].hasOwnProperty('sel'))) {
        throw new Error('传入的数组参数项有不是h函数的')
      }
      // 不需要执行c[i], 收集
      children.push(c[i])
    }
    return vnode(sel, data, c, undefined, undefined)
  } else if (typeof c === 'object'  && c.hasOwnProperty('sel')) {
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  } else {
    throw new Error('传入的第三个参数类型不对')
  }
}
