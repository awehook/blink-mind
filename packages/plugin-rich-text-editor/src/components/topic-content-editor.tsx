import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import * as React from 'react';
import { RichTextEditor } from './rich-text-editor';

import { contentEditorRefKey } from '@blink-mind/renderer-react';
import debug from 'debug';
const log = debug('node:topic-content-editor');

export class TopicContentEditor extends RichTextEditor {
  getCustomizeProps() {
    const { model, topicKey, readOnly } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block;
    const getRefKeyFunc = contentEditorRefKey;
    return {
      block,
      readOnly,
      getRefKeyFunc,
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
    log('onClickOutSide');
    const { model, topicKey } = this.props;
    const readOnly = model.editingContentKey !== topicKey;
    if (readOnly) return;
    const { controller } = this.props;
    controller.run('operation', {
      ...this.props,
      opType: OpType.SET_TOPIC_BLOCK,
      blockType: BlockType.CONTENT,
      data: this.state.content,
      focusMode: FocusMode.NORMAL
    });
  }
}
