import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import * as React from 'react';
import { RichTextEditor } from './rich-text-editor';

export class TopicContentEditor extends RichTextEditor {
  getCustomizeProps() {
    const { model, topicKey, readOnly } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block;
    const refKeyPrefix = 'content-editor';
    return {
      block,
      readOnly,
      refKeyPrefix,
      placeholder: ' '
    };
  }

  onChange(value) {
    const { controller, topicKey } = this.props;
    const key = `topic-content-data-${topicKey}`;
    controller.run('setTempValue', { key, value });
    this.setState({
      content: value
    });
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
