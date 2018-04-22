# tree-helper
js functions, just import needed functions.   
js 方法库, 按需使用  

```sh
// install
npm install tree-helper -S
```
### usage 使用
```
import {function1, function2} from 'tree-helper'

```
### some functions. pls check source to get more 常用方法, 请查看源码获取更多方法
```js
// depth first search; 深度优先遍历
depthFirstSearch(obj, handler, childrenKey = 'children', reverse)
- handler(item, i, parent)
    return false // break loop
    return 'skip children' // skip children
    return 'skip siblings' // skip siblings
// breadth first search; 广度优先遍历
breadthFirstSearch(obj, handler, childrenKey = 'children', reverse)
- handler(item, i, parent)
    return false // break loop
    return 'skip children' // skip children
    return 'skip siblings' // skip siblings
```
