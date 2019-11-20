## Model serialization and deserialization

The framework provides the plugin plugin-json-serializer to implement serialization and deserialization of json.

### Serializer

Plugin-json-serializer implements the middleware function: serializeModel

The outer layer can call controller.run('serializeModel', props) to serialize model to json.

```js
const props = this.diagram.getDiagramProps();
const { controller } = props;
const json = controller.run('serializeModel', props);
const jsonStr = JSON.stringify(json);
```

### Deserializer

Plugin-json-serializer implements the middleware function: deserializeModel

The outer layer can call controller.run('deserializeModel', props) to deserialize json to model.

```js
let obj = JSON.parse(txt);
let model = controller.run('deserializeModel', { controller, obj });
```
