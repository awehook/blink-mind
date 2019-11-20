The topic editor provided by blink-mind by default is a simple text editor that does not support rich text editing.

If you want the topic editor and the notes editor to support rich text editing, you can use the plugin-rich-text-editor provided by the framework.

```jsx
import richTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
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

The code provided by the framework for plugin-rich-text-editor is implemented as follows:

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

The specific code is implemented in [here](https://github.com/awehook/blink-mind/tree/master/packages/plugin-rich-text-editor/src/components),

If we want to customize the text editor of the topic, we can write a plugin ourselves, and implement the renderTopicContentEditor and renderTopicDescEditor functions in it.
