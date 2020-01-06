import richTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
import { Diagram } from '@blink-mind/renderer-react';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { BaseDemo } from '../common/base-demo';

// @ts-ignore
// @ts-ignore
import richTextEditorMdEn from './plugin-rich-text-editor-en.md';
// @ts-ignore
import richTextEditorMdZh from './plugin-rich-text-editor-zh.md';
// @ts-ignore
import simpleTextEditorMdEn from './simple-text-editor-en.md';
import simpleTextEditorMdZh from './simple-text-editor-zh.md';

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
    notes: {
      markdown: {
        en: simpleTextEditorMdEn,
        zh: simpleTextEditorMdZh
      }
    }
  })
  .add('rich-text-editor', () => <RichTextEditorPluginDemo />, {
    notes: {
      markdown: {
        en: richTextEditorMdEn,
        zh: richTextEditorMdZh
      }
    }
  });
