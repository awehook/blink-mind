import {
  BaseProps,
  iconClassName,
  TopicBlockIcon
} from '@blink-mind/renderer-react';
import { Popover, PopoverInteractionKind } from '@blueprintjs/core';
import * as React from 'react';
import { ExtDataReference } from './ext-data-reference';
import { ReferenceTopicList } from './reference-topic-list';
import { EXT_DATA_KEY_TOPIC_REFERENCE } from './utils';

export function TopicExtReference(props: BaseProps) {
  const { docModel, topicKey } = props;
  const extData: ExtDataReference = docModel.getExtDataItem(
    EXT_DATA_KEY_TOPIC_REFERENCE,
    ExtDataReference
  );
  const refRecord = extData.reference.get(topicKey);
  const referencedKeys = [];
  extData.reference.forEach((v, k) => {
    if (v.keyList.includes(topicKey)) referencedKeys.push(k);
  });
  if (
    (refRecord == null || refRecord.keyList.size === 0) &&
    referencedKeys.length === 0
  )
    return null;

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
