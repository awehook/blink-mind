import { configure, addDecorator, addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';
import { withNotes } from '@storybook/addon-notes';

addParameters({
  options: {
    theme: themes.dark
  }
});

addDecorator(withNotes);

function loadStories() {
  // require('../packages/renderer-react/stories/index.stories')
  require('../stories/index.stories');
}

configure(loadStories, module);
