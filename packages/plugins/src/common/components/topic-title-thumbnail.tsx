import { BaseProps, PropKey } from '@blink-mind/renderer-react';
import { PopoverInteractionKind } from '@blueprintjs/core';
import * as React from 'react';
import { StyledPopover, Tip, TipContent, TopicTitle } from './styled';

export interface TopicTitleThumbnailProps extends BaseProps {
  titleMaxLength?: number;
}

export function TopicTitleThumbnail(props: TopicTitleThumbnailProps) {
  const { controller, topicKey, titleMaxLength = 100 } = props;
  const navigateToTopic = e => {
    controller.run('focusTopicAndMoveToCenter', {
      ...props,
      topicKey
    });
  };
  const topicTitle = controller.getValue(PropKey.TOPIC_TITLE, props);

  const needTip = topicTitle.length > titleMaxLength;
  const title = needTip
    ? topicTitle.substr(0, titleMaxLength) + '...'
    : topicTitle;
  const titleProps = {
    key: topicKey,
    onClick: navigateToTopic
  };
  const titleEl = <TopicTitle {...titleProps}>{title}</TopicTitle>;
  const tip = (
    <Tip>
      <TipContent>{topicTitle}</TipContent>
    </Tip>
  );
  const popoverProps = {
    key: topicKey,
    target: titleEl,
    content: tip,
    fill: true,
    interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY,
    hoverOpenDelay: 1000
  };
  return needTip ? <StyledPopover {...popoverProps} /> : titleEl;
}
