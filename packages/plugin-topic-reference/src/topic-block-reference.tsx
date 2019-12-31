import { iconClassName, TopicBlockIcon } from '@blink-mind/renderer-react';
import { Classes, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import * as React from 'react';
import { ReferenceTopicList } from './reference-topic-list';
import { ReferenceTopicRecord } from './reference-topic-record';

export function TopicBlockReference(props) {
  const { block } = props;
  const data: ReferenceTopicRecord = block.data;
  if (data.reference.size === 0 && data.referenced.size === 0) return null;
  const iconProps = {
    className: iconClassName('reference'),
    tabIndex: -1
  };
  const icon = <TopicBlockIcon {...iconProps} />;
  const tooltipContent = <ReferenceTopicList {...props} />;
  const tooltipProps = {
    autoFocus: false,
    content: tooltipContent,
    target: icon,
    interactionKind: PopoverInteractionKind.CLICK,
    hoverOpenDelay: 500
  };
  return <Popover {...tooltipProps}></Popover>;
}
