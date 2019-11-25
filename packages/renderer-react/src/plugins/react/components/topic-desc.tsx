import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import { Drawer } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { Icon, iconClassName, IconName } from '../../../utils';

const log = debug('node:topic-desc');

const DescIcon = styled.div`
  &:hover {
  }
`;

const DescEditorWrapper = styled.div`
  overflow: auto;
  padding: 0px 0px 0px 20px;
  background: #88888850;
`;

export function TopicDesc(props) {
  const { controller, model, topicKey } = props;
  const isEditing = model.editingDescKey === topicKey;
  log('isEditing', isEditing);
  const onClick = e => {
    e.stopPropagation();
    controller.run('operation', {
      ...props,
      opType: OpType.START_EDITING_DESC
    });
  };

  const onDescEditorClose = e => {
    e.stopPropagation();
    const key = `topic-desc-data-${topicKey}`;
    const descData = controller.run('deleteTempValue', { key });
    controller.run('operation', {
      ...props,
      opArray: [
        {
          opType: OpType.SET_TOPIC_DESC,
          topicKey,
          data: descData
        },
        {
          opType: OpType.FOCUS_TOPIC,
          topicKey,
          focusMode: FocusMode.NORMAL
        }
      ]
    });
  };

  const desc = model.getTopic(topicKey).getBlock(BlockType.DESC);
  if (
    !isEditing &&
    controller.run('isBlockEmpty', { ...props, block: desc.block })
  )
    return null;
  const descIcon = desc.block && (
    <DescIcon
      onClick={onClick}
      className={iconClassName(IconName.NOTES)}
    ></DescIcon>
  );
  return (
    <>
      {descIcon}
      <Drawer
        title="Edit Notes"
        icon={Icon('note')}
        isOpen={isEditing}
        hasBackdrop
        isCloseButtonShown={false}
        onClose={onDescEditorClose}
      >
        <DescEditorWrapper>
          {controller.run('renderTopicDescEditor', props)}
        </DescEditorWrapper>
      </Drawer>
    </>
  );
}
