import * as React from 'react';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import debug from 'debug';
import { Controller, KeyType, Model } from '@blink-mind/core';
import plainSerializer from 'slate-plain-serializer';
const log = debug('node:topic-content-editor');

interface NodeContentProps {
  readOnly?: boolean;
}

const NodeContent = styled.div<NodeContentProps>`
  padding: 6px;
  background-color: ${props => (props.readOnly ? null : 'white')};
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
`;

interface Props {
  controller: Controller;
  model: Model;
  topicKey: KeyType;
  saveRef?: Function;
}

export class SimpleTextEditor extends React.PureComponent<Props> {
  onMouseDown = e => {
    e.stopPropagation();
  };

  onMouseMove = e => {
    e.stopPropagation();
  };
  onChange = (value: () => string) => {};

  // TODO
  onBlur = (event, editor, next) => {
    return next();
  };

  getCustomizeProps = () => {
    return null;
  };

  render() {
    const { topicKey, saveRef } = this.props;
    const {
      block,
      readOnly,
      refKeyPrefix,
      placeholder
    } = this.getCustomizeProps();
    let content = block.data;
    if (content == null) return null;
    if (typeof content === 'string') {
      content = plainSerializer.deserialize(content);
    }

    const key = `${refKeyPrefix}-${topicKey}`;
    const { onChange, onBlur, onMouseDown, onMouseMove } = this;
    const editorProps = {
      defaultValue: content,
      readOnly,
      onChange,
      // onBlur,
      placeholder
    };

    const nodeContentProps = {
      key,
      readOnly,
      ref: saveRef(key),
      onMouseDown,
      onMouseMove
    };
    return (
      <NodeContent {...nodeContentProps}>
        <Editor {...editorProps} autoFocus />
      </NodeContent>
    );
  }
}
