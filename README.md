<p align="center">
  一个 <em>完全</em> 可自由定制的思维导图框架。
  可以在这个框架基础上通过编写插件实现任何想要的效果的定制。
</p>

### 设计思路

1. 使用插件机制来将组件之间的耦合程度降到最低
2. 框架预先定义好了一些插件以提供默认的表现行为，当想要改变默认的行为时，可以编写插件，将默认行为的函数覆盖即可。
3. 通过compose 机制将同名的插件函数进行组合，每个插件函数中通过next参数来控制调用次序，类似于Koa的中间件机制。
4. 运行时数据通过immutable.js 数据结构保存，基于immutable.js 和 组件的shouldComponentUpdate来优化性能。

### 运行demo
```
yarn install
yarn storybook
```
then open http://localhost:6007/ 