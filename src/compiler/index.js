/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 1、将html字符串解析成AST（语法抽象树）
  const ast = parse(template.trim(), options)
  // 2、优化的核心目标，标记静态节点
  // 静态子树是在AST中永远不变的节点，如纯文本节点。
  //什么是静态节点
  // 两级包裹，纯文本，比如：
   //<div>静态<span>节点</span></div>
  //静态根节点里面是静态节点
  // 递归找到静态根节点，如果children 也是静态节点，那就定义为静态节点。未来就会生成静态函数，在做patch的之后会跳过
  //vue的处理工作方式：官方认为，如果只有一标签，消耗有些大，去占用内存。所以静态节点指的两层都为静态节点
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // 3、将ast生成为函数字符串，还不是函数，而是函数的字符串
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
