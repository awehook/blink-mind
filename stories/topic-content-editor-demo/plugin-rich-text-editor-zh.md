blink-mind 默认提供的topic editor是一个简单的文本编辑器,不支持富文本编辑。

如果想要topic节点以及notes 的文本编辑器支持富文本编辑，可以使用框架提供的plugin-rich-text-editor.

```jsx
import richTextEditorPlugin from "@blink-mind/plugin-rich-text-editor";
const plugins = [richTextEditorPlugin()];

export class RichTextEditorPluginDemo extends BaseDemo {

  renderDiagram() {
    return (
      <Diagram
        model={this.state.model}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }
}
```

框架提供的plugin-rich-text-editor的代码实现如下：

```jsx
import * as React from 'react';
import { TopicContentEditor } from '../components/topic-content-editor';
import { TopicDescEditor } from '../components/topic-desc-editor';
export default function RichTextEditorPlugin() {
  return {
    renderTopicContentEditor(props) {
      return <TopicContentEditor {...props} />;
    },

    renderTopicDescEditor(props) {
      return <TopicDescEditor {...props} />;
    }
  };
}
```
具体的代码实现在[这里](https://github.com/awehook/blink-mind/tree/master/packages/plugin-rich-text-editor/src/components),

如果我们想自定义topic的文本编辑器，可以自己写一个plugin, 在里面实现renderTopicContentEditor和renderTopicDescEditor函数