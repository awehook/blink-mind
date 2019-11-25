import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import { Drawer } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';

const log = debug('node:topic-desc');

const ContentEditorWrapper = styled.div`
  overflow: auto;
  padding: 0px 0px 0px 20px;
  background: #88888850;
`;

export function TopicContent(props) {
  const { controller, model, topicKey } = props;
  const isEditing = model.editingContentKey === topicKey;

  const onContentEditorClose = e => {
    e.stopPropagation();
    const key = `topic-content-data-${topicKey}`;
    const value = controller.run('deleteTempValue', { key });
    controller.run('operation', {
      ...props,
      opArray: [
        {
          opType: OpType.SET_TOPIC_CONTENT,
          topicKey,
          data: value
        },
        {
          opType: OpType.FOCUS_TOPIC,
          topicKey,
          focusMode: FocusMode.NORMAL
        }
      ]
    });
  };

  const drawer = isEditing && (
    <Drawer
      title="Edit Content"
      isOpen={isEditing}
      hasBackdrop
      isCloseButtonShown={false}
      onClose={onContentEditorClose}
    >
      <ContentEditorWrapper>
        {controller.run('renderTopicContentEditor', props)}
      </ContentEditorWrapper>
    </Drawer>
  );

  return (
    <>
      {controller.run('renderTopicContentEditor', { ...props, readOnly: true })}
      {drawer}
    </>
  );
}
