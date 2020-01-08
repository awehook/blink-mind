import { OpType } from '@blink-mind/core';
import {
  BaseProps,
  SettingBoxContainer,
  SettingGroup,
  SettingTitle
} from '@blink-mind/renderer-react';
import * as React from 'react';
import { TagRecord } from '../ext-data-tags';
import {
  OP_TYPE_ADD_TAG,
  OP_TYPE_ADD_TOPIC_TAG,
  OP_TYPE_REMOVE_TOPIC_TAG
} from '../utils';
import { TagWidget } from './tag-widget';

export function TopicTagsWidget(props: BaseProps) {
  const { controller, topicKey } = props;
  const topicTags: TagRecord[] = controller.run('getTopicTags', props);
  const tagsCanBeAdded: TagRecord[] = controller.run(
    'getTopicTagsCanBeAdded',
    props
  );
  const topicTagsWidget = topicTags.map(tag => {
    const tagProps = {
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
        <SettingTitle>Tags Already Added</SettingTitle>
        <SettingBoxContainer>{topicTagsWidget}</SettingBoxContainer>
      </SettingGroup>

      <SettingGroup>
        <SettingTitle>Tags that Can be Added</SettingTitle>
        <SettingBoxContainer>{tagsCanBeAddedWidget}</SettingBoxContainer>
      </SettingGroup>
    </>
  );
}
