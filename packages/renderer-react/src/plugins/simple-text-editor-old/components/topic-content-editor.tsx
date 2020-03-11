import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import { SimpleTextEditor } from './simple-text-editor';
import { TempValueKey } from '../../../utils';
const log = require('debug')('node:topic-content-editor');

function contentEditorRefKey(key) {
  return `content-editor-${key}`;
}

export class TopicContentEditor extends SimpleTextEditor {
  constructor(props) {
    super(props);
  }
  getCustomizeProps() {
    const { model, topicKey, readOnly } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block;
    const getRefKeyFunc = contentEditorRefKey;
    const style = {
      whiteSpace: 'pre'
    };
    return {
      block,
      readOnly,
      getRefKeyFunc,
      placeholder: 'new',
      style
    };
  }

  onKeyDown = e => {
    if (e.nativeEvent.ctrlKey && e.nativeEvent.code === 'Enter') {
      this.save();
    }
  };

  onChange({ value }) {
    super.onChange({ value });
    const { controller } = this.props;
    controller.run('setTempValue', { key: TempValueKey.EDITOR_CONTENT, value });
  }

  onClickOutSide(e) {
    log('onClickOutSide',this.props.topicKey);
    super.onClickOutSide(e);
    this.save();
  }

  save() {
    const { controller, model, topicKey } = this.props;
    //TODO
    // const readOnly = model.editingContentKey !== topicKey;
    // if (readOnly) return;
    controller.run('operation', {
      ...this.props,
      opType: OpType.SET_TOPIC_BLOCK,
      blockType: BlockType.CONTENT,
      data: this.state.content,
      focusMode: FocusMode.NORMAL
    });
  }
}
