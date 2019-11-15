import { configure, addDecorator, addParameters } from '@storybook/react';
// import { DocsContainer } from '@storybook/addon-docs/blocks';
// import DocsPage from './docs-page';
import { themes } from '@storybook/theming';
import { addReadme } from 'storybook-multi-readme';
import {withNotes} from "@storybook/addon-notes";

addParameters({
  options: {
    theme: themes.dark
  }
});

addDecorator(addReadme);

addDecorator(withNotes)

function loadStories() {
  // require('../packages/renderer-react/stories/index.stories')
  require('../stories/index.stories');
}

configure(loadStories, module);
