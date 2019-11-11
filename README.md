<p align="center">
  A <em>fully</em> customizable mind map framework based on plugin mechanism.
  Customization of any desired effect can be achieved by writing a plugin based on this framework.
</p>

### [Online Demo](https://awehook.github.io/blink-mind/)


### Design Ideas

1. Use plugin mechanism to minimize coupling between components

2. The framework pre-defines some plugins to provide default behavior. When you want to change the default behavior, you can write plugins that override the default behavior.

3. The plugin functions of the same name are combined by the compose mechanism. Each plugin function controls the order of calls through the next parameter, similar to Koa's middleware mechanism.

4. Runtime data is saved through the immutable.js data structure, optimizing performance based on immutable.js and component's shouldComponentUpdate.

### Run Demo
```
yarn install
yarn storybook
```
then open http://localhost:6007/ 