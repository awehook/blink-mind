import { BaseProps, PropKey } from '@blink-mind/renderer-react';
import * as React from 'react';
import { TopicTitle } from './styled';
import Highlighter from 'react-highlight-words';

export interface TopicTitleThumbnailProps extends BaseProps {
  titleMaxLength?: number;
  query?: string;
}

export function TopicTitleThumbnail(props: TopicTitleThumbnailProps) {
  const { controller, topicKey, query, titleMaxLength = 100 } = props;
  const navigateToTopic = e => {
    controller.run('focusTopicAndMoveToCenter', {
      ...props,
      topicKey
    });
  };
  const topicTitle = controller.getValue(PropKey.TOPIC_TITLE, props);

  // const needTip = topicTitle.length > titleMaxLength;
  // const title = needTip
  //   ? topicTitle.substr(0, titleMaxLength) + '...'
  //   : topicTitle;
  const titleProps = {
    key: topicKey,
    onClick: navigateToTopic
  };
  return (
    <TopicTitle {...titleProps}>
      {query
        ? Highlighter({ searchWords: [query], textToHighlight: topicTitle })
        : topicTitle}
    </TopicTitle>
  );
}
