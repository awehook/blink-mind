import { BlockType } from '@blink-mind/core';
import {descEditorRefKey, getI18nText, I18nKey} from '@blink-mind/renderer-react';
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
    const props = this.props;
    const { model, topicKey } = props;
    const block = model.getTopic(topicKey).getBlock(BlockType.DESC).block;
    const readOnly = model.editingDescKey !== topicKey;
    //TODO
    const getRefKeyFunc = descEditorRefKey;
    return {
      block,
      readOnly,
      getRefKeyFunc,
      placeholder: getI18nText(props,I18nKey.NOTE_PLACEHOLDER)
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
