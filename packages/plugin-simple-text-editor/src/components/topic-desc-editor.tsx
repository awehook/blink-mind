import { BlockType } from '@blink-mind/core';
import { SimpleTextEditor } from './simple-text-editor';

import debug from 'debug';
const log = debug('node:topic-desc-editor');

function descEditorRefKey(key) {
  return `desc-editor-${key}`;
}

export class TopicDescEditor extends SimpleTextEditor {
  constructor(props) {
    super(props);
    log('constructor');
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
    const getRefKeyFunc = descEditorRefKey;
    return {
      block,
      readOnly,
      getRefKeyFunc,
      placeholder: 'write topic notes here'
    };
  }

  onChange({ value }) {
    log('onChange');
    const { controller, topicKey, model } = this.props;
    const readOnly = model.editingDescKey !== topicKey;
    if (readOnly) return;
    const key = `topic-desc-data-${topicKey}`;
    controller.run('setTempValue', { key, value });
    this.setState({
      content: value
    });
  }
}
