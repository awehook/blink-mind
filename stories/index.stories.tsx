import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { SimpleDemo } from './SimpleDemo';
import { RichTextEditorPluginDemo } from './RichTextEditorPluginDemo';

const debugNameSpaces = ['core:*', 'node:*', 'plugin:*', 'modifier'];

localStorage.debug = debugNameSpaces.join(',');

storiesOf('blink-mind', module)
  .add('SimpleDemo', () => <SimpleDemo />)
  .add('RichTextEditorPluginDemo', () => <RichTextEditorPluginDemo />);
