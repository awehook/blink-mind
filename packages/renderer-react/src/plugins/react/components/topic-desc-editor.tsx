import * as React from 'react';
import { BaseProps } from '../../../components/BaseProps';
import styled from 'styled-components';
import RichMarkDownEditor from 'awehook-rich-markdown-editor';
import { BlockType } from '@blink-mind/core';
import debug from 'debug';
import { BaseWidget } from '../../../components/common';
import { OpType } from '../../operation';

const log = debug('node:topic-desc-editor');

interface NodeContentProps {
  readOnly?: boolean;
}

const DescEditor = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const NodeContent = styled.div<NodeContentProps>`
  padding: 6px;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: ${props => (props.readOnly ? null : 'white')};
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
`;

interface Props extends BaseProps {}

export class TopicDescEditor extends BaseWidget<Props> {
  onChange = (value: () => string) => {
    this.operation(OpType.SET_TOPIC_DESC, { ...this.props, desc: value });
  };

  render() {
    const { model, topicKey, saveRef } = this.props;
    const desc = model.getTopic(topicKey).getBlock(BlockType.DESC).block;
    log(desc);
    const editingDescKey = model.editingDescKey;

    const readOnly = !(topicKey === editingDescKey);
    const key = `desc-${topicKey}`;
    return (
      <DescEditor>
        <NodeContent readOnly={readOnly} ref={saveRef(key)}>
          <RichMarkDownEditor
            editorValue={desc.data}
            readOnly={readOnly}
            onChange={this.onChange}
          />
        </NodeContent>
      </DescEditor>
    );
  }
}
