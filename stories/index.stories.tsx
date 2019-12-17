import * as React from 'react';
import { configure } from '@storybook/react';

const debugNameSpaces = [
  // 'core:*',
  'node:*',
  // 'node:drag-scroll-widget',
  // 'node:topic-content-widget',
  // 'node:topic-desc-editor',
  // 'node:style-editor',
  // 'plugin:StylePlugin',
  // 'plugin:*',
  'plugin:event',
  'story:*',
  'modifier'

];

localStorage.debug = debugNameSpaces.join(',');

function loadStories() {
  const req = require.context('./', true, /\.stories\.(js|jsx|ts|tsx)$/);
  req.keys().forEach(req);
}

configure(loadStories, module);
