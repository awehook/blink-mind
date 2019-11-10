import * as React from 'react';
import { OpType } from '@blink-mind/renderer-react';
import { RichTextEditor } from './rich-text-editor';
import { BlockType } from '@blink-mind/core';

export class TopicDescEditor extends RichTextEditor {
  getCustomizeProps = () => {
    const { model, topicKey } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.DESC).block;
    const readOnly = model.editingDescKey !== topicKey;
    const refKeyPrefix = 'desc-editor';
    return {
      block,
      readOnly,
      refKeyPrefix
    };
  };
  onChange = (value: () => string) => {
    this.operation(OpType.SET_TOPIC_DESC, {
      ...this.props,
      desc: value
    });
  };
}
