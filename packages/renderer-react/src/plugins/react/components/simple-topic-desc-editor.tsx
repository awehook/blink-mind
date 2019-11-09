import * as React from 'react';
import { BaseProps } from '../../../components/base-props';
import styled from 'styled-components';
import { Block, BlockType } from '@blink-mind/core';
import { BaseWidget } from '../../../components/common';
import { OpType } from '../../operation';
import debug from 'debug';
import { SimpleTextEditor } from './simple-text-editor';
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

export class SimpleTopicDescEditor extends BaseWidget<Props> {
  onMouseDown = e => {
    e.stopPropagation();
  };

  onMouseMove = e => {
    e.stopPropagation();
  };
  onChange = value => {
    this.operation(OpType.SET_TOPIC_DESC, { ...this.props, desc: value });
  };

  render() {
    const { model, topicKey, saveRef } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.DESC).block;
    const content = block.data;
    const editingDescKey = model.editingDescKey;

    const readOnly = !(topicKey === editingDescKey);
    const key = `desc-${topicKey}`;
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
