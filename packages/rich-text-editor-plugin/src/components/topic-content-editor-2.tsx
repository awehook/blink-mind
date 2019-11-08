import * as React from 'react';
import { BaseProps, BaseWidget, OpType } from '@blink-mind/renderer-react';
import styled from 'styled-components';
import RichMarkDownEditor from 'awehook-rich-markdown-editor';
import { Block, BlockType } from '@blink-mind/core';
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

interface CustomizeProps {
  block: Block;
  readOnly: boolean;
  refKeyPrefix: string;
}

export class TopicContentEditor2 extends BaseWidget {
  onMouseDown = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };

  onMouseMove = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };
  getCustomizeProps = () => {
    const { model, topicKey } = this.props;
    const block = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block;
    const readOnly = model.editingContentKey !== topicKey;
    const refKeyPrefix = 'content-editor';
    return {
      block,
      readOnly,
      refKeyPrefix
    };
  };
  onChange = (value: () => string) => {
    this.operation(OpType.SET_TOPIC_CONTENT, {
      ...this.props,
      content: value
    });
  };

  render() {
    const { topicKey, saveRef } = this.props;
    const { block, readOnly, refKeyPrefix } = this.getCustomizeProps();
    const content = block.data;
    if (!content) return null;
    const key = `${refKeyPrefix}-${topicKey}`;
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
