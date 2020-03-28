import React, { MutableRefObject, useRef } from 'react';
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
  handleOnInput?: (e) => boolean;
  innerEditorDivRef?: MutableRefObject<HTMLElement>;
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
    handleKeyDown: _handleKeyDown,
    handleOnInput
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

  const innerEditorDivRef = props.innerEditorDivRef || useRef<HTMLElement>();

  const handleKeyDown = e => {
    if (_handleKeyDown(e)) return true;
    if (e.keyCode === Key.UpArrow || e.keyCode === Key.DownArrow) {
      const sel = window.getSelection();
      if (sel.isCollapsed) {
        const anchorNode = sel.anchorNode;
        const anchorOffSet = sel.anchorOffset;
        // const focusNode = sel.focusNode;
        // const focusOffset = sel.focusOffset;
        // log(anchorNode, sel.anchorOffset);
        const innerEditorDiv = innerEditorDivRef.current;
        if (e.keyCode === Key.UpArrow) {
          let oldRange = sel.getRangeAt(0);
          let range = new Range();
          range.setStartBefore(innerEditorDiv.firstChild);
          range.setEnd(anchorNode, anchorOffSet);
          sel.removeAllRanges();
          sel.addRange(range);
          // log(sel,sel.toString());
          if (sel.toString().length === 0) {
            controller.run('operation', {
              ...props,
              opType: OlOpType.MOVE_FOCUS,
              dir: 'U'
            });
            return true;
          }
          sel.removeAllRanges();
          sel.addRange(oldRange);
        } else {
          let range = new Range();
          range.setStart(anchorNode, anchorOffSet);
          range.setEndAfter(innerEditorDiv.lastChild);
          sel.removeAllRanges();
          sel.addRange(range);
          if (sel.toString().length === 0) {
            controller.run('operation', {
              ...props,
              opType: OlOpType.MOVE_FOCUS,
              dir: 'D'
            });
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleOnPaste = e => {
    console.log('handleOnPaste');
    e.preventDefault();
    const pasteType = controller.run('getPasteType', props);
    if (pasteType === 'PASTE_PLAIN_TEXT') {
      const text = e.clipboardData.getData('text/plain');
      setTimeout(() => {
        document.execCommand('insertText', false, text);
      });
    } else if (pasteType === 'PASTE_WITH_STYLE') {
      const html = e.clipboardData.getData('text/html');
      setTimeout(() => {
        document.execCommand('insertHTML', false, html);
      });
    }
  };

  const editProps = {
    className: cx('bm-content-editable', className),
    handleKeyDown,
    handleOnInput,
    handleOnPaste,
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
