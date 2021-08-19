
import patchVnode from './patchVnode'
import createElement from './createElement'

function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}

export default function updateChildren(parentElm, oldCh, newCh) {
  // 旧前
  let oldStartIdx = 0;
  // 新前
  let newStartIdx = 0;
  // 旧后
  let oldEndIdx = oldCh.length - 1;
  // 新前
  let newEndIdx = newCh.length - 1;
  // 旧前节点
  let oldStartVnode = oldCh[0];
  // 旧后节点
  let oldEndVnode = oldCh[oldEndIdx];
  // 新前节点
  let newStartVnode = newCh[0];
  // 新后节点
  let newEndVnode = newCh[newEndIdx];

  let keyMap = null

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 首先不是要加命中判断，而是略过undefined标记
    if (oldStartVnode == null || oldCh[oldStartIdx] ===  undefined) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode == null || oldCh[oldEndIdx] === undefined) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null || newCh[newStartIdx] === undefined) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null || newCh[newEndIdx] === undefined) {
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldStartVnode, newStartVnode)) {
      //1、新前和旧前
      console.log('🌟新前和旧前命中')
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (checkSameVnode(oldEndVnode, newEndVnode)) {
      // 2、新后和旧后
      console.log('🌟新后和旧后命中')
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldStartVnode, newEndVnode)) {
      // 3、 新后和旧前
      console.log('🌟新后和旧前命中')
      patchVnode(oldStartVnode, newEndVnode)
      //当3新后和旧前命中时，此时要移动节点。移动新前指向这个节点移动到旧后之后。
      // 如何移动节点？只要插入一个已经在DOM树上的节点，它就会被移动
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]

    } else if (checkSameVnode(oldEndVnode, newStartVnode)) {
      // 4、新前和旧后
      console.log('🌟新前和旧后命中')
      patchVnode(oldEndVnode, newStartVnode)
      //当4新前和旧后命中时，此时要移动节点。移动新前指向这个节点移动到旧前之前。
      // 如何移动节点？只要插入一个已经在DOM树上的节点，它就会被移动
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 四种都没命中
      // 寻找key的map
      if (!keyMap) {
        keyMap = {}
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key;
          if (key !== undefined) {
            keyMap[key] = i;
          }
        }
      }
      // 寻找当前这项newStartIdx在keyMap中映射的位置序号
      const idxInOld = keyMap[newStartVnode.key]
      if (idxInOld === undefined) {
        // 全新的项, 新增
        //
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // 非全新的项要移动
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode)
        // 把这项设置undefined，表示已经处理了
        oldCh[idxInOld] = undefined
        // 移动
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)

      }
      // 指针下移，只移新的
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 继续看还有没有剩的
  if (newStartIdx <= newEndIdx) {
    console.log('new还有剩余节点');
    // 插入标杆, undefined == null
    // const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
    for (let i = newStartIdx; i < newEndIdx; i++) {
      // insertBefor会自动识别null，如果是null就会自动排到队尾，和appendChild一致了
      parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm);
    }
  } else if (oldStartIdx <= oldEndIdx) {
    console.log('old还有剩余节点');
    for (let i = oldStartIdx; i < oldEndIdx; i++) {
      // 批量删除oldStartIdx和oldEndIdx之间的项
      if (oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm);
      }
    }
  }

}
