import { iconClassName, TopicBlockIcon } from '@blink-mind/renderer-react';
import * as React from 'react';

import {
  BLOCK_TYPE_TOPOLOGY,
  FOCUS_MODE_EDITING_TOPOLOGY,
  OP_TYPE_START_EDITING_TOPOLOGY
} from './utils';

export function TopicBlockTopology(props) {
  const { controller, model, topicKey } = props;
  const onClick = e => {
    e.stopPropagation();
    controller.run('operation', {
      ...props,
      opType: OP_TYPE_START_EDITING_TOPOLOGY
    });
  };
  const isEditing =
    model.focusKey === topicKey &&
    model.focusMode === FOCUS_MODE_EDITING_TOPOLOGY;

  const { block } = model.getTopic(topicKey).getBlock(BLOCK_TYPE_TOPOLOGY);

  if (!isEditing && !block) return null;
  const iconProps = {
    className: iconClassName('topology'),
    onClick,
    tabIndex: -1
  };

  return <TopicBlockIcon {...iconProps} />;
}
