import * as React from 'react';
import { BaseProps, BaseWidget, OpType } from '@blink-mind/renderer-react';
import styled from 'styled-components';
import RichMarkDownEditor from 'awehook-rich-markdown-editor';
import { Block } from '@blink-mind/core';
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

export class RichTextEditor extends BaseWidget {
  onMouseDown = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };

  onMouseMove = e => {
    console.log('onMouseDown');
    e.stopPropagation();
  };
  onChange = (value: () => string) => {}

  getCustomizeProps = () => {
    return null;
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
