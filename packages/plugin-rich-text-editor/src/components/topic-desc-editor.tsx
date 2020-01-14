import { BlockType } from '@blink-mind/core';
import { descEditorRefKey } from '@blink-mind/renderer-react';
import * as React from 'react';
import { RichTextEditor } from './rich-text-editor';

export class TopicDescEditor extends RichTextEditor {
  constructor(props) {
    super(props);
  }
  initState() {
    super.initState();
    const { controller, topicKey } = this.props;
    const key = `topic-desc-data-${topicKey}`;
    const value = this.state.content;
    controller.run('setTempValue', { key, value });
  }

  getCustomizeProps() {
    const { model, topicKey } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.DESC).block;
    const readOnly = model.editingDescKey !== topicKey;
    //TODO
    const getRefKeyFunc = descEditorRefKey;
    return {
      block,
      readOnly,
      getRefKeyFunc,
      placeholder: 'write topic notes here'
    };
  }

  onChange(value) {
    const { controller, topicKey } = this.props;
    const key = `topic-desc-data-${topicKey}`;
    controller.run('setTempValue', { key, value });
    this.setState({
      content: value
    });
  }
}
