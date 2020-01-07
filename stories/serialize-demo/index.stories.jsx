import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseDemo } from '../common/base-demo';
import { Diagram } from '@blink-mind/renderer-react';
import { JsonSerializerPlugin } from '@blink-mind/plugin-json-serializer';
import { OpenFilePlugin, ExportFilePlugin } from '@blink-mind/plugins';
import RichTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';

import styled from 'styled-components';

import debug from 'debug';

import jsonSerializerMdEn from './json-serializer-en.md';
import jsonSerializerMdZh from './json-serializer-zh.md';

const log = debug('story:json-serializer');

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const plugins = [
  RichTextEditorPlugin(),
  OpenFilePlugin(),
  ExportFilePlugin(),
  JsonSerializerPlugin()
];
class JsonSerializerDemo extends BaseDemo {
  constructor(props) {
    super(props);
  }

  diagram;
  diagramRef = e => {
    this.diagram = e;
  };
  renderDiagram() {
    return (
      <Container>
        <Diagram
          model={this.state.model}
          onChange={this.onChange}
          plugins={plugins}
          ref={this.diagramRef}
        />
      </Container>
    );
  }
}

storiesOf('serializer-demo', module).add(
  'json-serializer',
  () => <JsonSerializerDemo />,
  {
    notes: {
      markdown: {
        en: jsonSerializerMdEn,
        zh: jsonSerializerMdZh
      }
    }
  }
);
