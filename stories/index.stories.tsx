import * as React from 'react';
import { configure } from '@storybook/react';

const debugNameSpaces = [
  // 'core:*',
  // 'node:*',
  // 'node:save-ref',
  // 'node:topic-content-editor',
  // 'node:topic-sub-links',
  // 'node:drag-scroll-widget',
  // 'node:topic-content-widget',
  // 'node:topic-desc-editor',
  // 'node:style-editor',
  // 'plugin:StylePlugin',
  // 'plugin:*',
  // 'plugin:event',
  'plugin:json-serializer',
  'plugin:operation',
  // 'story:*',
  'modifier'

];

localStorage.debug = debugNameSpaces.join(',');

function loadStories() {
  const req = require.context('./', true, /\.stories\.(js|jsx|ts|tsx)$/);
  req.keys().forEach(req);
}

configure(loadStories, module);
