import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import * as React from 'react';
import { SimpleTextEditor } from './simple-text-editor';

import debug from 'debug';
const log = debug('node:topic-content-editor');

export class TopicContentEditor extends SimpleTextEditor {
  constructor(props) {
    super(props);
  }
  getCustomizeProps() {
    const { model, topicKey, readOnly } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block;
    const refKeyPrefix = 'content-editor';
    return {
      block,
      readOnly,
      refKeyPrefix,
      placeholder: 'new'
    };
  }
  // onChange = ({ value }) => {
  //   log('onChange');
  //   const { model, topicKey } = this.props;
  //   const readOnly = model.editingContentKey !== topicKey;
  //   if (readOnly) return;
  //   const { controller } = this.props;
  //   controller.run('operation', {
  //     ...this.props,
  //     opType: OpType.SET_TOPIC_CONTENT,
  //     content: value
  //   });
  // };

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
