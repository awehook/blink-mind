import * as React from 'react';
import { BaseProps } from '../../../components/BaseProps';
import styled from 'styled-components';
import { Block } from '@blink-mind/core/src/models/block';
import { BaseWidget } from '../../../components/common';
import { OpType } from '../../operation';
import debug from 'debug';
import {SimpleTextEditor} from "./simple-text-editor";
const log = debug('node:topic-content-editor');

interface NodeContentProps {
  readOnly?: boolean;
}

const NodeContent = styled.div<NodeContentProps>`
  padding: 6px;
  background-color: ${props => (props.readOnly ? null : 'white')};
  color: black;
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
`;

interface Props extends BaseProps {
  block: Block;
}

export class SimpleTopicContentEditor extends BaseWidget<Props> {
  onMouseDown = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };

  onMouseMove = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };
  onChange = (value) => {
    this.operation(OpType.SET_TOPIC_CONTENT, { ...this.props, content: value });
  };

  render() {
    const { model, topicKey, saveRef, block } = this.props;
    const content = block.data;
    const editingContentKey = model.editingContentKey;

    const readOnly = !(topicKey === editingContentKey);
    const key = `editor-${topicKey}`;
    return (
      <NodeContent
        key={key}
        readOnly={readOnly}
        ref={saveRef(key)}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
      >
        <SimpleTextEditor
          editorValue={content}
          readOnly={readOnly}
          onChange={this.onChange}
        />
      </NodeContent>
    );
  }
}
