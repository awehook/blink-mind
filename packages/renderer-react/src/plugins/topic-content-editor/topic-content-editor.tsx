import React from 'react';
import { BlockType, OpType } from '@blink-mind/core';
import { BaseProps } from '../../components/common';
import ContentEditable from './react-contenteditable';
import cx from 'classnames';
import { Key } from 'ts-keycode-enum';

export interface Props extends BaseProps {
  className: string;
  handleKeyDown: (e) => boolean;
}

export function TopicContentEditor(props: Props) {
  const {
    controller,
    model,
    topicKey,
    topic,
    readOnly,
    className,
    handleKeyDown: _handleKeyDown
  } = props;
  let content = topic.getBlock(BlockType.CONTENT).block.data;

  const onChange = evt => {
    const data = evt.target.value;
    if (data !== topic.contentData) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_TOPIC_BLOCK,
        blockType: BlockType.CONTENT,
        data
      });
    }
  };

  const handleKeyDown = e => {
    if (_handleKeyDown(e)) return true;
    const isEditorRoot = model.editorRootTopicKey === topicKey;
    switch (e.keyCode) {
      case Key.Backspace:
        if (topic.contentData === '') {
          controller.run('operation', {
            ...props,
            opType: OpType.DELETE_TOPIC
          });
          return true;
        }
        break;
      case Key.Delete:
        !isEditorRoot &&
          controller.run('operation', {
            ...props,
            opType: OpType.DELETE_TOPIC
          });
        return true;
    }
    return false;
  };

  const editProps = {
    className: cx('bm-content-editable', className),
    handleKeyDown,
    html: content,
    disabled: readOnly,
    focus: model.focusKey === topicKey,
    placeholder: 'new topic',
    // onChange: v => {
    //   setEditorState(v);
    // }
    onChange
  };
  return <ContentEditable {...editProps} />;
}
