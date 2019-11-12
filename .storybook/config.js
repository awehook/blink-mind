import { configure, addDecorator, addParameters } from '@storybook/react';
// import { DocsContainer } from '@storybook/addon-docs/blocks';
// import DocsPage from './docs-page';
import { themes } from '@storybook/theming';
import { addReadme } from 'storybook-readme';
addParameters({
  options: {
    theme: themes.dark
  }
});

addDecorator(addReadme);

function loadStories() {
  // require('../packages/renderer-react/stories/index.stories')
  require('../stories/index.stories');
}

configure(loadStories, module);
