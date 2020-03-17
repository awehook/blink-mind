import React, { useRef } from 'react';
import { BlockType, OpType } from '@blink-mind/core';
import { BaseProps } from '../../components/common';
import ContentEditable from './react-contenteditable';
import cx from 'classnames';
import { Key } from 'ts-keycode-enum';
//TODO
import { OlOpType } from '../../../../../../renderer/plugins/outliner/op';

const log = require('debug')('node:topic-content-editor');

export interface Props extends BaseProps {
  className: string;
  handleKeyDown: (e) => boolean;
}

let debounce = false;

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
      if (debounce) {
        //无法进行undo
        controller.run('operation', {
          ...props,
          opType: OpType.SET_TOPIC_BLOCK_CONTENT,
          data
        });
        setTimeout(() => {
          debounce = false;
        }, 2000);
      } else {
        controller.run('operation', {
          ...props,
          opType: OpType.SET_TOPIC_BLOCK,
          blockType: BlockType.CONTENT,
          data
        });
        debounce = true;
      }
    }
  };

  const innerEditorDivRef = useRef<HTMLElement>();

  const handleKeyDown = e => {
    if (_handleKeyDown(e)) return true;
    const isEditorRoot = model.editorRootTopicKey === topicKey;
    if (e.keyCode === Key.UpArrow || e.keyCode === Key.DownArrow) {
      const selection = window.getSelection();
      const anchorNode = selection.anchorNode;
      let innerEditorDiv = innerEditorDivRef.current;
      if (e.keyCode === Key.UpArrow) {
        if (
          anchorNode === innerEditorDiv ||
          anchorNode === innerEditorDiv.firstChild
          //&& selection.anchorOffset === 0
        ) {
          controller.run('operation', {
            ...props,
            opType: OlOpType.MOVE_FOCUS,
            dir: 'U'
          });
          return true;
        }
      } else if (
        anchorNode === innerEditorDiv ||
        anchorNode === innerEditorDiv.lastChild
        //&& (anchorNode.nodeType !== Node.TEXT_NODE || (anchorNode.nodeType===Node.TEXT_NODE && selection.anchorOffset === ((Text)anchorNode).wholeText.length-1)
      ) {
        controller.run('operation', {
          ...props,
          opType: OlOpType.MOVE_FOCUS,
          dir: 'D'
        });
        return true;
      }
    }
    switch (e.keyCode) {
      case Key.D:
        if (e.altKey) {
          const desc = topic.getBlock(BlockType.DESC).block;
          if (e.shiftKey) {
            desc &&
              controller.run('operation', {
                ...props,
                opType: OpType.DELETE_TOPIC_BLOCK,
                blockType: BlockType.DESC
              });
          } else {
            controller.run('operation', {
              ...props,
              opType: OpType.START_EDITING_DESC
            });
          }
          return true;
        }
        break;
      case Key.F:
        if (e.altKey) {
          controller.run('operation', {
            ...props,
            opType: OpType.SET_EDITOR_ROOT
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
      case Key.UpArrow:
        break;
      case Key.DownArrow:
        break;
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
    innerRef: innerEditorDivRef,
    // onChange: v => {
    //   setEditorState(v);
    // }
    onChange
  };

  log(
    'render',
    topicKey
    // innerEditorDivRef.current
  );
  return <ContentEditable {...editProps} />;
}
