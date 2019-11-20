import * as React from 'react';
import { RichTextEditor } from './rich-text-editor';
import { BlockType } from '@blink-mind/core';

export class TopicDescEditor extends RichTextEditor {
  getCustomizeProps() {
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
  }
  onChange(value) {
    const { controller } = this.props;
    controller.run('setTopicDescTempValue', { value });
    this.setState({
      content: value
    });
  }
}
