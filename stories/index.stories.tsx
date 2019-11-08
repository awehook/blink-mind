import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { SimpleDemo } from './simple-demo';
import { RichTextEditorPluginDemo } from './rich-text-editor-plugin-demo';
import {CustomizeTopicContextMenuDemo} from "./customize-topic-context-menu-demo";

const debugNameSpaces = ['core:*', 'node:*', 'plugin:*', 'modifier'];

localStorage.debug = debugNameSpaces.join(',');

storiesOf('blink-mind', module)
  .add('SimpleDemo', () => <SimpleDemo />)
  .add('RichTextEditorPluginDemo', () => <RichTextEditorPluginDemo />)
  .add('CustomizeTopicContextMenuDemo', () => <CustomizeTopicContextMenuDemo />);
