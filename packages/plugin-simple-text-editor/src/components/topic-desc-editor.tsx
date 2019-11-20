import * as React from 'react';
import { SimpleTextEditor } from './simple-text-editor';
import { BlockType, OpType } from '@blink-mind/core';

export class TopicDescEditor extends SimpleTextEditor {
  getCustomizeProps = () => {
    const { model, topicKey } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.DESC).block;
    const readOnly = model.editingDescKey !== topicKey;
    const refKeyPrefix = 'desc-editor';
    return {
      block,
      readOnly,
      refKeyPrefix,
      placeholder: 'write topic notes here'
    };
  };
  onChange = (value: () => string) => {
    const { controller } = this.props;

    controller.run('operation', {
      ...this.props,
      opType: OpType.SET_TOPIC_DESC,
      desc: value
    });
  };
}
