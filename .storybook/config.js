import { configure } from '@storybook/react';

function loadStories() {
  require('../packages/renderer-react/stories/index.stories')
}

configure(loadStories, module);