<p align="center">
    <a href="https://github.com/awehook/blink-mind"><img src="https://img.shields.io/github/license/awehook/blink-mind.svg" alt="MIT"/></a>
    <a href="https://www.npmjs.com/package/@blink-mind/core"><img src="https://img.shields.io/npm/v/@blink-mind/core.svg?style=flat"/></a>
    <a href="https://join.slack.com/t/vscode-blink-mind/shared_invite/enQtODkyMzc0OTc0NDM1LWRlYjI3YzFmYjRiM2UwY2ExZGIzMDI3NzY4ODAwMmZlMTE3YjMxNGE1MDM4MTY5ZWNjZWJjYWQ4ZGFhZWZmZDc"><img src="https://img.shields.io/badge/join-us%20on%20slack-gray.svg?longCache=true&logo=slack&colorB=brightgreen" alt="Slack Widget"></a>
</p>
<p align="center">
  A <em>fully</em> customizable mind map framework based on plugin mechanism.
  Customization of any desired effect can be achieved by writing a plugin based on this framework.
</p>

### [Full-featured app based on this library](https://awehook.github.io/react-mindmap)

### [A mind map vscode extension based on this library](https://github.com/awehook/vscode-blink-mind)

### [Multiple online demo of specific features](https://awehook.github.io/blink-mind/)

### Design Ideas

1. Use plugin mechanism to minimize coupling between components

2. The framework pre-defines some plugins to provide default behavior. When you want to change the default behavior, you can write plugins that override the default behavior.

3. The plugin functions of the same name are combined by the compose mechanism. Each plugin function controls the order of calls through the next parameter, similar to Koa's middleware mechanism.

4. Runtime data is saved through the immutable.js data structure, optimizing performance based on immutable.js and component's shouldComponentUpdate.

### Run Demo Locally

```
yarn install
yarn storybook
```

then open http://localhost:6007/
