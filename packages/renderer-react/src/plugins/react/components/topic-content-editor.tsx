import * as React from 'react';
import { BaseProps } from '../../../components/BaseProps';
import styled from 'styled-components';
import RichMarkDownEditor from 'awehook-rich-markdown-editor';
import { BlockType } from '@blink-mind/core/src/types';
import { Block } from '@blink-mind/core/src/models/block';
import debug from 'debug';

const log = debug('node:topic-content-editor');

interface NodeContentProps {
  readOnly?: boolean;
}

const NodeContent = styled.div<NodeContentProps>`
  padding: 6px 6px;
  background-color: ${props => (props.readOnly ? null : '#e0e0e0')};
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
`;

interface Props extends BaseProps {
  block: Block;
}

export class TopicContentEditor extends React.Component<Props> {
  render() {
    const { model, topicKey, saveRef, block } = this.props;
    const content = block.data;
    const editingContentKey = model.editingContentKey;

    const readOnly = !(topicKey === editingContentKey);
    const key = `editor-${topicKey}`;
    return (
      <NodeContent key={key} readOnly={readOnly} ref={saveRef(key)}>
        <RichMarkDownEditor editorValue={content} readOnly={readOnly} />
      </NodeContent>
    );
  }
}
