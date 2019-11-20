## 序列化 Model

框架提供了默认的插件 plugin-json-serializer 来实现 json 的序列化和反序列化.

### 序列化

plugin-json-serializer 实现了 serializeModel 的方法

在外层可以通过 controller.run('serializeModel', props) 来将 model 序列化为 json.

```js
const props = this.diagram.getDiagramProps();
const { controller } = props;
const json = controller.run('serializeModel', props);
const jsonStr = JSON.stringify(json);
```

### 反序列化

plugin-json-serializer 实现了 deserializeModel 的方法

在外层可以通过 controller.run('deserializeModel', props) 来将 json 反序列化为 model.

```js
let obj = JSON.parse(txt);
let model = controller.run('deserializeModel', { controller, obj });
```
