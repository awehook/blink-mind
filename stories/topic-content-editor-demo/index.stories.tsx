import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseDemo } from '../common/base-demo';
import { Diagram } from '@blink-mind/renderer-react';
import richTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';

// @ts-ignore
import simpleTextEditorMd from './simple-text-editor.md';
// @ts-ignore
import richTextEditorMd from './plugin-rich-text-editor.md';

export class SimpleTopicContentEditorDemo extends BaseDemo {
  renderDiagram() {
    return <Diagram model={this.state.model} onChange={this.onChange} />;
  }
}

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

storiesOf('topic-content-editor-demo', module)
  .add('simple-text-editor', () => <SimpleTopicContentEditorDemo />, {
    readme: { sidebar: simpleTextEditorMd }
  })
  .add('rich-text-editor', () => <RichTextEditorPluginDemo />, {
    readme: {
      sidebar: richTextEditorMd
    }
  });
