import * as React from 'react';
import { TopicContentWidget } from './components/topic-content-widget';
import { BlockType } from '@blink-mind/core/src/types';
import { TopicContentEditor } from './components/topic-content-editor';
import { RootWidget } from './components/root-widget';
import { TopicWidget } from './components/topic-widget';
import { TopicPopupMenu } from './components/topic-popup-menu';
import { TopicCollapseIcon } from './components/topic-collapse-icon';
import { StyleEditor } from './components/style-editor/style-editor';
import debug from 'debug';
import { TopicSubLinks } from './components/topic-sublinks';
import { RootSubLinks } from './components/root-sublinks';
import { linksRefKey } from '../../utils/keys';
import { TopicHighlight } from './components/topic-highlight';
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

    renderTopicWidget(props) {
      return <TopicWidget {...props} />;
    },

    renderTopicContent(props) {
      return <TopicContentWidget {...props} />;
    },

    renderTopicPopupMenu(props) {
      return <TopicPopupMenu {...props} />;
    },

    renderTopicContentEditor(props) {
      log('renderTopicContentEditor', props);
      return <TopicContentEditor {...props} />;
    },

    renderTopicCollapseIcon(props) {
      return <TopicCollapseIcon {...props} />;
    },

    renderBlocks(props) {
      const { model, topicKey, controller } = props;
      const topic = model.getTopic(topicKey);
      const blocks = topic.blocks;
      let res = [],
        i = 0;
      blocks.forEach(block => {
        const b = controller.run('renderBlock', {
          ...props,
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

    renderBlock(props) {
      const { controller, block, key } = props;
      switch (block.type) {
        case BlockType.CONTENT:
          return controller.run('renderTopicContentEditor', props);
        default:
          break;
      }
      return null;
    },

    renderSubLinks(props) {
      const { saveRef, topicKey, model } = props;
      const topic = model.getTopic(topicKey);
      if (topic.subKeys.size === 0 || topic.collapse) return null;
      return <TopicSubLinks ref={saveRef(linksRefKey(topicKey))} {...props} />;
    },

    renderRootSubLinks(props) {
      const { saveRef, topicKey, model } = props;
      const topic = model.getTopic(topicKey);
      if (topic.subKeys.size === 0) return null;
      return <RootSubLinks ref={saveRef(linksRefKey(topicKey))} {...props} />;
    },

    renderFocusItemHighlight(props) {
      const { saveRef } = props;
      return <TopicHighlight ref={saveRef('focus-highlight')} {...props} />;
    },

    renderStyleEditor(props) {

      return <StyleEditor {...props} />;
    }
  };
}
