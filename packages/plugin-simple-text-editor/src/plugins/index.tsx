import * as React from 'react';
import { TopicContentEditor } from '../components/topic-content-editor';
import { TopicDescEditor } from '../components/topic-desc-editor';
import plainSerializer from 'slate-plain-serializer';
import { BlockType } from '@blink-mind/core';

export default function SimpleTextEditorPlugin() {
  return {
    renderTopicContentEditor(props) {
      return <TopicContentEditor {...props} />;
    },

    renderTopicDescEditor(props) {
      return <TopicDescEditor {...props} />;
    },

    isBlockEmpty(props, next) {
      const { block, controller } = props;
      if (block.type === BlockType.CONTENT || block.type === BlockType.DESC) {
        return (
          block.data == null ||
          controller.run('serializeBlockData', props) === ''
        );
      }
      return next();
    },

    serializeBlockData(props, next) {
      const { block } = props;
      if (block.type === BlockType.CONTENT || block.type === BlockType.DESC) {
        return typeof block.data === 'string'
          ? block.data
          : plainSerializer.serialize(block.data);
      }
      return next();
    },

    serializeBlock(props, next) {
      const { block, controller } = props;
      if (block.type === BlockType.CONTENT || block.type === BlockType.DESC) {
        const res = {
          type: block.type,
          data: controller.run('serializeBlockData', props)
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
