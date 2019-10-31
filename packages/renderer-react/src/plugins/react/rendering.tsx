import * as React from 'react';
import { TopicContentWidget } from './components/topic-content-widget';
import { BlockType } from '@blink-mind/core/src/types';
import { TopicContentEditor } from './components/topic-content-editor';

import debug from 'debug';
import { RootWidget } from './components/root-widget';
import { TopicWidget } from './components/topic-widget';
import { TopicPopupMenu } from './components/topic-popup-menu';
import { StyleEditor } from './components/style-editor/style-editor';
const log = debug('plugin:rendering');

export function RenderingPlugin() {
  return {
    renderDiagram({ children }) {
      return children;
    },

    renderDoc({ children }) {
      return children;
    },

    renderRootWidget(props) {
      return <RootWidget {...props} />;
    },

    renderTopicWidget( props ) {
      return <TopicWidget {...props} />;
    },

    renderTopicContent(props) {
      return <TopicContentWidget {...props} />;
    },

    renderTopicPopupMenu(props) {
      return <TopicPopupMenu {...props} />;
    },

    renderTopicContentEditor({ props, block }) {
      const editorProps = { ...props, block };
      log('renderTopicContentEditor', editorProps);
      return <TopicContentEditor {...editorProps} />;
    },

    renderTopicCollapseIcon({props}) {

    },

    renderBlocks({ props }) {
      const { model, topicKey, controller } = props;
      const topic = model.getTopic(topicKey);
      const blocks = topic.blocks;
      let res = [],
        i = 0;
      blocks.forEach(block => {
        const b = controller.run('renderBlock', {
          props,
          block,
          blockKey: `block-${i}`
        });
        if (b) {
          res.push(<React.Fragment key={`block-${i}`}>{b}</React.Fragment>);
          i++;
        }
      });
      return res;
    },

    renderBlock({ props, block, key }) {
      const { controller } = props;
      switch (block.type) {
        case BlockType.CONTENT:
          return controller.run('renderTopicContentEditor', {
            props,
            block,
            key
          });
        default:
          break;
      }
      return null;
    },

    renderLink(props, diagram, next) {},

    renderStyleEditor(props) {
      return <StyleEditor {...props} />;
    }
  };
}
