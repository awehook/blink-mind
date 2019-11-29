import { BlockType } from '@blink-mind/core';
import * as React from 'react';
import plainSerializer from 'slate-plain-serializer';
import { TopicContentEditor } from '../components/topic-content-editor';
import { TopicDescEditor } from '../components/topic-desc-editor';

export default function SimpleTextEditorPlugin() {
  return {
    getTopicTitle(props) {
      const { model, controller, topicKey } = props;
      const topic = model.getTopic(topicKey);
      const block = topic.getBlock(BlockType.CONTENT).block;
      const txt = controller.run('serializeBlockData', { ...props, block });
      return txt;
    },

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
