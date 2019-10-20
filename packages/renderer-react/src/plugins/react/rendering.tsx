import * as React from 'react';

import { TopicContentWidget } from './components/topic-content-widget';

export function RenderingPlugin() {
  return {
    renderDiagram({ children }) {
      return children;
    },

    renderDoc({ children }) {
      return children;
    },

    renderTopicContent(props, diagram) {
      return <TopicContentWidget {...props} />;
    },

    renderContentEditor(props, diagram, next) {},

    renderBlock({ attrs, children }) {
      return <div>{children}</div>;
    },

    renderLink(props, diagram, next) {

    }
  };
}
