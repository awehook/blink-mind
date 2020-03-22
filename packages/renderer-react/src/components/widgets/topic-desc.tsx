import { BlockType, OpType } from '@blink-mind/core';
import * as React from 'react';
import { iconClassName, IconName } from '../../utils';
import { TopicBlockIcon } from '../common';

const log = require('debug')('node:topic-desc');

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
  return (
    <TopicBlockIcon
      onClick={onClick}
      className={iconClassName(IconName.NOTES)}
      tabIndex={-1}
    />
  );
}
