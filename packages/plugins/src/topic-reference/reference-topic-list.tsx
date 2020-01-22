import { FocusMode } from '@blink-mind/core';
import {
  BaseProps,
  cancelEvent,
  getI18nText,
  I18nKey
} from '@blink-mind/renderer-react';
import * as React from 'react';
import styled from 'styled-components';
import { ExtDataReference } from './ext-data-reference';
import { ReferenceTopicThumbnail } from './reference-topic-thumbnail';
import {
  EXT_DATA_KEY_TOPIC_REFERENCE,
  OP_TYPE_SET_REFERENCE_TOPICS
} from './utils';
const Root = styled.div``;

const Group = styled.div`
  padding: 10px;
`;

const GroupList = styled.div`
  max-height: 200px;
  overflow: auto;
`;

const GroupTitle = styled.div`
  font-size: 20px;
  color: #106ba3;
`;

const GotoBtn = styled.div`
  text-decoration: underline;
  color: #106ba3;
  cursor: pointer;
`;

export function ReferenceTopicList(props: BaseProps) {
  const { topicKey, controller, model } = props;
  const extData: ExtDataReference = model.extData.get(
    EXT_DATA_KEY_TOPIC_REFERENCE
  );

  const removeReference = refKey => e => {
    e.stopPropagation();
    const keyList = extData.reference.get(topicKey).keyList;
    controller.run('operation', {
      ...props,
      opArray: [
        {
          opType: OP_TYPE_SET_REFERENCE_TOPICS,
          topicKey: topicKey,
          focusMode: FocusMode.NORMAL,
          referenceKeys: keyList.delete(keyList.indexOf(refKey)).toArray()
        }
      ]
    });
  };

  const referenceKeys = extData.getReferenceKeys(topicKey);

  const referenceGroup =
    referenceKeys.length === 0 ? null : (
      <Group>
        <GroupTitle>
          {getI18nText(props, I18nKey.REFERENCE_TOPICS) + ':'}
        </GroupTitle>
        <GroupList>
          {referenceKeys.map(key => {
            const thumbProps = {
              ...props,
              key,
              refKey: key,
              refType: 'reference',
              removeHandler: removeReference(key)
            };
            //@ts-ignore
            return <ReferenceTopicThumbnail {...thumbProps} />;
          })}
        </GroupList>
      </Group>
    );

  const referencedKeys = extData.getReferencedKeys(topicKey);

  const referencedGroup =
    referencedKeys.length === 0 ? null : (
      <Group>
        <GroupTitle>
          {getI18nText(props, I18nKey.REFERENCED_TOPICS) + ':'}
        </GroupTitle>
        <GroupList>
          {referencedKeys.map(key => {
            const thumbProps = {
              ...props,
              key,
              refKey: key,
              refType: 'referenced'
            };
            //@ts-ignore
            return <ReferenceTopicThumbnail {...thumbProps} />;
          })}
        </GroupList>
      </Group>
    );

  const onClickGotoOriginTopic = e => {
    e.stopPropagation();
    controller.run('focusTopicAndMoveToCenter', props);
  };

  const currentTopic = model.focusKey !== topicKey && (
    <Group>
      <GotoBtn onClick={onClickGotoOriginTopic}>Goto Origin Topic</GotoBtn>
    </Group>
  );

  return (
    <Root onMouseDown={cancelEvent}>
      {referenceGroup}
      {referencedGroup}
      {currentTopic}
    </Root>
  );
}
