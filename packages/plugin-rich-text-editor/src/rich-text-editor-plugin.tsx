import { BlockType } from '@blink-mind/core';
import * as React from 'react';
import { TopicDescEditor } from './components/topic-desc-editor';
import markdownSerializer from './markdown-serializer';
export default function RichTextEditorPlugin() {
  return {
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
      if (block.type === BlockType.DESC) {
        return typeof block.data === 'string'
          ? block.data
          : markdownSerializer.serialize(block.data);
      }
      return next();
    }
  };
}
