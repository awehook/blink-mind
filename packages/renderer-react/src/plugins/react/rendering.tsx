import * as React from 'react';
import { TopicContentWidget } from './components/topic-content-widget';
import { BlockType } from '@blink-mind/core/src/types';
import { TopicContentEditor } from './components/topic-content-editor';

import debug from 'debug';
const log = debug('plugin:rendering');

export function RenderingPlugin() {
  return {
    renderDiagram({ children }) {
      return children;
    },

    renderDoc({ children }) {
      return children;
    },

    renderTopicContent({ props, block }, diagram) {
      return <TopicContentWidget {...props} />;
    },

    renderTopicContentEditor({ props, block }, diagram, next) {
      const editorProps = { ...props, block };
      log('renderTopicContentEditor',editorProps);
      return <TopicContentEditor {...editorProps} />;
    },

    renderBlocks({ props }, diagram, next) {
      const { model, topicKey, controller } = props;
      const topic = model.getTopic(topicKey);
      const blocks = topic.blocks;
      let res = [],
        i = 0;
      blocks.forEach(block => {
        const b = controller.run('renderBlock', { props, block, blockKey: `block-${i}` });
        if (b) {
          res.push(
            <React.Fragment key={`block-${i}`}>
              {b}
            </React.Fragment>
          );
          i++;
        }
      });
      return res;
    },

    renderBlock({ props, block, key }) {
      const { controller } = props;
      switch (block.type) {
        case BlockType.CONTENT:
          return controller.run('renderTopicContentEditor', { props, block,key });
        default:
          break;
      }
      return null;
    },

    renderLink(props, diagram, next) {}
  };
}
