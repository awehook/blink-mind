import * as React from 'react';
import { SimpleTextEditor } from './simple-text-editor';
import { BlockType, FocusMode, OpType } from '@blink-mind/core';

export class TopicContentEditor extends SimpleTextEditor {
  getCustomizeProps = () => {
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
  };
  onChange = value => {
    const { controller, topicKey } = this.props;
    if (value.value.selection.isBlurred) {
      controller.run('operation', {
        ...this.props,
        opType: OpType.FOCUS_TOPIC,
        topicKey: topicKey,
        focusMode: FocusMode.NORMAL
      });
      return;
    }

    controller.run('operation', {
      ...this.props,
      opType: OpType.SET_TOPIC_CONTENT,
      content: value
    });
  };

  onBlur = (value, editor, next) => {
    next();
    const { controller, topicKey } = this.props;
    controller.run('operation', {
      ...this.props,
      opType: OpType.FOCUS_TOPIC,
      topicKey: topicKey,
      focusMode: FocusMode.NORMAL
    });
  };
}
