import {
  BaseProps,
  getI18nText,
  I18nKey,
  SettingBoxContainer,
  SettingGroup,
  SettingTitle
} from '@blink-mind/renderer-react';
import * as React from 'react';
import { TagRecord } from '../ext-data-tags';
import { OP_TYPE_ADD_TOPIC_TAG, OP_TYPE_REMOVE_TOPIC_TAG } from '../utils';
import { StyledTagWidget as TagWidget } from './tag-widget';

export function TopicTagsWidget(props: BaseProps) {
  const { controller } = props;
  const topicTags: TagRecord[] = controller.run('getTopicTags', props);
  const tagsCanBeAdded: TagRecord[] = controller.run(
    'getTopicTagsCanBeAdded',
    props
  );
  const topicTagsWidget = topicTags.map(tag => {
    const tagProps = {
      ...props,
      isTopicTag: true,
      tag,
      onRemove: (tag: TagRecord) => e => {
        controller.run('operation', {
          ...props,
          opType: OP_TYPE_REMOVE_TOPIC_TAG,
          tagName: tag.name
        });
      }
    };
    return <TagWidget key={tag.name} {...tagProps} />;
  });

  const tagsCanBeAddedWidget = tagsCanBeAdded.map(tag => {
    const tagProps = {
      ...props,
      isTopicTag: true,
      tag,
      onClick: (tag: TagRecord) => e => {
        controller.run('operation', {
          ...props,
          opType: OP_TYPE_ADD_TOPIC_TAG,
          tagName: tag.name
        });
      }
    };
    return <TagWidget key={tag.name} {...tagProps} />;
  });
  return (
    <>
      <SettingGroup>
        <SettingTitle>{getI18nText(props, I18nKey.ALREADY_ADDED)}</SettingTitle>
        <SettingBoxContainer>{topicTagsWidget}</SettingBoxContainer>
      </SettingGroup>

      <SettingGroup>
        <SettingTitle>{getI18nText(props, I18nKey.CAN_BE_ADDED)}</SettingTitle>
        <SettingBoxContainer>{tagsCanBeAddedWidget}</SettingBoxContainer>
      </SettingGroup>
    </>
  );
}
