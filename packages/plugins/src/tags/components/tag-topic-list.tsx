import {
  BaseProps,
  getI18nText,
  I18nKey,
  SettingBoxContainer,
  SettingTitle,
  VListContainer
} from '@blink-mind/renderer-react';
import * as React from 'react';
import {
  TopicTitleThumbnail,
  TopicTitleThumbnailProps
} from '../../common/components/topic-title-thumbnail';
import { TagRecord } from '../ext-data-tags';

export interface TagTopicListProps extends BaseProps {
  tag: TagRecord;
}
export function TagTopicList(props: TagTopicListProps) {
  const { tag } = props;
  const topicList = tag.topicKeys.map(topicKey => {
    const thumbnailProps: TopicTitleThumbnailProps = {
      ...props,
      topicKey
    };
    return <TopicTitleThumbnail key={topicKey} {...thumbnailProps} />;
  });
  return (
    <>
      <SettingTitle>
        {getI18nText(props, I18nKey.TOPICS_THAT_USE_THIS_TAG)}
      </SettingTitle>
      <SettingBoxContainer>
        <VListContainer>{topicList}</VListContainer>
      </SettingBoxContainer>
    </>
  );
}
