import * as React from 'react';
import { configure } from '@storybook/react';

const debugNameSpaces = ['core:*', 'node:*', 'plugin:*', 'modifier'];

localStorage.debug = debugNameSpaces.join(',');

function loadStories() {
  const req = require.context('./', true, /\.stories\.(js|jsx|ts|tsx)$/);
  req.keys().forEach(req);
}

configure(loadStories, module);
