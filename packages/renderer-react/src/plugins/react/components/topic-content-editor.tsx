import * as React from 'react';
import { Block } from '@blink-mind/core';
import { BaseProps } from '../../../components/base-props';
import styled from 'styled-components';
import RichMarkDownEditor from 'awehook-rich-markdown-editor';
import { BaseWidget } from '../../../components/common';
import { OpType } from '../../operation';
import debug from 'debug';
const log = debug('node:topic-content-editor');

interface NodeContentProps {
  readOnly?: boolean;
}

const NodeContent = styled.div<NodeContentProps>`
  padding: 6px;
  background-color: ${props => (props.readOnly ? null : 'white')};
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
`;

interface Props extends BaseProps {
  block: Block;
}

export class TopicContentEditor extends BaseWidget<Props> {
  onMouseDown = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };

  onMouseMove = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };
  onChange = (value: () => string) => {
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
        <RichMarkDownEditor
          editorValue={content}
          readOnly={readOnly}
          onChange={this.onChange}
        />
      </NodeContent>
    );
  }
}
