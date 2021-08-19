/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // ASSET_TYPES是一个数组:['component', 'directive', 'filter']
  ASSET_TYPES.forEach(type => {
    /*vue.component('comp',{
      template:'<div>this is comp</div>'
    })*/
    // components举例子 Vue.component = function ('comp', {}) {}
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // 未声明component时，去options中获取components
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          // 组件的name
          definition.name = definition.name || id
          // _base是Vue
          // Vue.extend({}) 返回的是构造函数 把组件的配置项转化为组件的构造函数 ？？？
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // ？？？？
        // 注册到components 选项中去,
        // 全局组建，就是在根组建上去创建一个组建挂载在components里
        // 在vue原始选项上添加组建配置，将来其他组件继承，他们都会有这些组建注册
        this.options[type + 's'][id] = definition
        // // 如果使用的是component 最终返回的是 组建的构造函数
        return definition
      }
    }
  })
}
