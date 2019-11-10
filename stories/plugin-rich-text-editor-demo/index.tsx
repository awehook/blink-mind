import * as React from 'react';
import { Diagram } from '@blink-mind/renderer-react';
import richTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
import { BaseDemo } from '../common/base-demo';


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
