import React, { useState } from 'react';
import { BlockType, OpType } from '@blink-mind/core';
import { BaseProps } from '../../components/common';
import { Editor, EditorState, ContentState } from 'draft-js';
// import {ContentEditable} from "./content-editable";
import ContentEditable from './react-contenteditable';
import cx from 'classnames';

export interface Props extends BaseProps {
  className: string;
  handleKeyDown: (e) => boolean;
}

export function TopicContentEditor(props: Props) {
  const { controller, topic, readOnly, className, handleKeyDown } = props;
  let content = topic.getBlock(BlockType.CONTENT).block.data;
  // if (typeof es === 'string') {
  //   es = EditorState.createWithContent(ContentState.createFromText(es));
  // }
  // const [editorState, setEditorState] = useState(es);
  const onChange = evt => {
    controller.run('operation', {
      ...props,
      opType: OpType.SET_TOPIC_BLOCK,
      blockType: BlockType.CONTENT,
      data: evt.target.value
    });
  };
  const editProps = {
    className: cx('bm-content-editable', className),
    handleKeyDown,
    html: content,
    disabled: readOnly,
    placeholder: 'new topic',
    // onChange: v => {
    //   setEditorState(v);
    // }
    onChange
  };
  return <ContentEditable {...editProps} />;
}
