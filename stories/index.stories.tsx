import { configure } from '@storybook/react';

const debugNameSpaces = [
  // 'core:*',
  // 'node:*',
  // 'node:save-ref',
  // 'node:root-sub-links',
  // 'node:topic-content-editor',
  // 'node:topic-sub-links',
  // 'node:topic-widget',
  // 'node:drag-scroll-widget',
  // 'node:topic-content-widget',
  // 'node:topic-desc-editor',
  // 'node:style-editor',
  'node:theme-editor',
  // 'plugin:StylePlugin',
  // 'plugin:*',
  // 'plugin:event',
  'plugin:rendering',
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
