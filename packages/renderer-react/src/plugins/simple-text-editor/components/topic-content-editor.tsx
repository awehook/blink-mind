import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import debug from 'debug';
import { SimpleTextEditor } from './simple-text-editor';
const log = debug('node:topic-content-editor');

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

  onClickOutSide(e) {
    log('onClickOutSide');
    this.save();
  }

  save() {
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
