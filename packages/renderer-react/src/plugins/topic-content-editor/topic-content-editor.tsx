import { BlockType, DocModel, OpType } from '@blink-mind/core';
import cx from 'classnames';
import { Stack } from 'immutable';
import isUrl from 'is-url';
import React, { MutableRefObject, useRef } from 'react';
import { BaseProps } from '../../components/common';
import ContentEditable from './react-contenteditable';

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
  const content = topic.getBlock(BlockType.CONTENT).block.data;

  const onChange = evt => {
    log('inputType', evt.nativeEvent.inputType);
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
    return _handleKeyDown(e);
  };

  const handleOnPaste = e => {
    log('handleOnPaste');
    // e.preventDefault();
    const pasteType = controller.run('getPasteType', props);
    const bmind = e.clipboardData.getData('text/bmind');
    if (bmind) {
      const json = JSON.parse(bmind);
      log(json);
      controller.run('pasteFromJson', { ...props, json });
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
      log({ text, html });
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
