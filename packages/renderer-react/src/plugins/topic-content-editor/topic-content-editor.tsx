import React, { MutableRefObject, useRef } from 'react';
import { BlockType, OpType, DocModel } from '@blink-mind/core';
import { BaseProps } from '../../components/common';
import ContentEditable from './react-contenteditable';
import cx from 'classnames';
import isUrl from 'is-url';
import { Key } from 'ts-keycode-enum';
//TODO
import { OlOpType } from '../../../../../../renderer/plugins/outliner/op';
import { Stack } from 'immutable';

const log = require('debug')('node:topic-content-editor');

export interface Props extends BaseProps {
  className: string;
  handleKeyDown: (e) => boolean;
  handleOnInput?: (e) => boolean;
  innerEditorDivRef?: MutableRefObject<HTMLElement>;
}

let debounce = false;
let _isPaste = false;

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
    console.log('inputType', evt.nativeEvent.inputType);
    const data = evt.target.value;
    if (evt.type === 'blur') {
      const { undoStack }: { undoStack: Stack<DocModel> } = controller.run(
        'getUndoRedoStack',
        props
      );
      const lastUndoDocModel = undoStack.peek();
      if (lastUndoDocModel && lastUndoDocModel.currentSheetModel) {
        const lastTopic = lastUndoDocModel.currentSheetModel.getTopic(topicKey);
        if (lastTopic && lastTopic.contentData !== data) {
          controller.run('operation', {
            ...props,
            opType: OpType.SET_TOPIC_BLOCK,
            blockType: BlockType.CONTENT,
            data
          });
          return;
        }
      }
    }
    if (
      evt.nativeEvent.inputType === 'historyUndo' ||
      evt.nativeEvent.inputType === 'historyRedo'
    ) {
      evt.nativeEvent.preventDefault();
      return;
    }
    if (data !== topic.contentData) {
      if (debounce && !_isPaste) {
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
    _isPaste = false;
  };

  const innerEditorDivRef = props.innerEditorDivRef || useRef<HTMLElement>();

  const handleKeyDown = e => {
    if (_handleKeyDown(e)) return true;
    if (!controller.run('isCommandOrControl', { ...props, ev: e })) {
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
    }
    return false;
  };

  const handleOnPaste = e => {
    console.log('handleOnPaste');
    // e.preventDefault();
    const pasteType = controller.run('getPasteType', props);
    const bmind = e.clipboardData.getData('text/bmind');
    if (bmind) {
      console.log(JSON.parse(bmind));
    }
    // else if (pasteType === 'PASTE_WITH_STYLE') {
    //   console.log('PASTE_WITH_STYLE');
    //   const html = e.clipboardData.getData('text/html');
    //   setTimeout(() => {
    //     _isPaste = true;
    //     document.execCommand('insertHTML', false, html);
    //   });
    // }
    else {
      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');
      console.log({ text, html });
      // 无法递归执行document.execCommand
      // _isPaste = true;
      // //@ts-ignore
      _isPaste = true;
      if (isUrl(text)) {
        e.preventDefault();
        document.execCommand(
          'insertHtml',
          false,
          `<a href=${text}>${text}</a>`
        );
      }
    }

    controller.run('setPasteType', { pasteType: null });
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
