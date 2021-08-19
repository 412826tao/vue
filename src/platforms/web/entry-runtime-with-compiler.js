/* @flow */

//  入口文件

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index' // 返回一个Dom元素
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

// 返回DOM元素的innerHTML(template模板字符串)
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 获取定义的$mount
// 重写$mount，
// 扩展$mount的主要目的是：判断是否需要编译出渲染函数

// Vue.prototype.$mount来源是platforms/web/runtime/index-学习h.js,此处是扩展
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  // 传入的el是body或者html节点，处理方法
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function

  // 当render不存在的时候
  if (!options.render) {
    let template = options.template
    // if当template存在的时候
    // else if 当el存在的时候
    // 所以处理的优先级是render > template > el
    if (template) {
      //1、 if ->template是字符串
      //1-1、template是id选择器，将id选择器转换成template字符串模板，如果转换出来的是空，提示template不存在或者为空
      //2、 else if ->template是DOM节点->获取节点的innerHTML（template字符串模板）
      //3、 else ->提示无效template选项
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 通过el获取template字符串模板
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
// 获取当前元素以及内容的template字符串模板
function getOuterHTML (el: Element): string {
  // if ->el元素真实存在，直接获取el元素的template字符串模板
  // else if ->el元素不是真实存在，创建一个div，将el元素追加在其中，返回该div的innerHTML，从而获取el元素的template字符串模板
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
