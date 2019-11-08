import * as React from 'react';
import { OpType } from '@blink-mind/renderer-react';
import { RichTextEditor } from './rich-text-editor';
import { BlockType } from '@blink-mind/core';


export class TopicContentEditor extends RichTextEditor {
  getCustomizeProps = () => {
    const { model, topicKey } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block;
    const readOnly = model.editingContentKey !== topicKey;
    const refKeyPrefix = 'content-editor';
    return {
      block,
      readOnly,
      refKeyPrefix
    };
  };
  onChange = (value: () => string) => {
    this.operation(OpType.SET_TOPIC_CONTENT, {
      ...this.props,
      content: value
    });
  };
}
