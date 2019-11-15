import * as React from 'react';
import { TopicContentEditor } from '../components/topic-content-editor';
import { TopicDescEditor } from '../components/topic-desc-editor';
import markdownSerializer from '../markdown-serializer';
import { BlockType } from '@blink-mind/core';
export default function RichTextEditorPlugin() {
  return {
    renderTopicContentEditor(props) {
      return <TopicContentEditor {...props} />;
    },

    renderTopicDescEditor(props) {
      return <TopicDescEditor {...props} />;
    },

    serializeBlock(props, next) {
      const { block } = props;
      if (block.type === BlockType.CONTENT || block.type === BlockType.DESC) {
        const res = {
          type: block.type,
          data:
            typeof block.data === 'string'
              ? block.data
              : markdownSerializer.serialize(block.data)
        };
        return res;
      }
      return next();
    },

    deserializeBlock(props, next) {
      return next();
    }
  };
}
