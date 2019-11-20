import * as React from 'react';
import { RichTextEditor } from './rich-text-editor';
import { BlockType, FocusMode, OpType } from '@blink-mind/core';

export class TopicContentEditor extends RichTextEditor {
  getCustomizeProps() {
    const { model, topicKey } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block;
    const readOnly = model.editingContentKey !== topicKey;
    const refKeyPrefix = 'content-editor';
    return {
      block,
      readOnly,
      refKeyPrefix,
      placeholder: ' '
    };
  }
  onClickOutSide(e) {
    const { model, topicKey } = this.props;
    const readOnly = model.editingContentKey !== topicKey;
    if (readOnly) return;
    const { controller } = this.props;
    controller.run('operation', {
      ...this.props,
      opType: OpType.SET_TOPIC_CONTENT,
      data: this.state.content
    });

    controller.run('operation', {
      ...this.props,
      opType: OpType.FOCUS_TOPIC,
      focusMode: FocusMode.NORMAL
    });
  }
}
