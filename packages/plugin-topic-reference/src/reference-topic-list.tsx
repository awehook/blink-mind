import { FocusMode } from '@blink-mind/core';
import { cancelEvent } from '@blink-mind/renderer-react';
import * as React from 'react';
import styled from 'styled-components';
import { ReferenceTopicRecord } from './reference-topic-record';
import { ReferenceTopicThumbnail } from './reference-topic-thumbnail';
import { OP_TYPE_SET_REFERENCE_TOPICS } from './utils';
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

export function ReferenceTopicList(props) {
  const { block, topicKey, controller } = props;
  const data: ReferenceTopicRecord = block.data;
  const removeReference = refKey => e => {
    e.stopPropagation();
    controller.run('operation', {
      ...props,
      opArray: [
        {
          opType: OP_TYPE_SET_REFERENCE_TOPICS,
          topicKey: topicKey,
          focusMode: FocusMode.NORMAL,
          referenceKeys: data.reference
            .delete(data.reference.indexOf(refKey))
            .toArray()
        }
      ]
    });
  };
  const referenceGroup =
    data.reference.size === 0 ? null : (
      <Group>
        <GroupTitle>Reference Topics:</GroupTitle>
        <GroupList>
          {data.reference.map(key => {
            const thumbProps = {
              ...props,
              key,
              refKey: key,
              refType: 'reference',
              removeHandler: removeReference(key)
            };
            return <ReferenceTopicThumbnail {...thumbProps} />;
          })}
        </GroupList>
      </Group>
    );

  const referencedGroup =
    data.referenced.size === 0 ? null : (
      <Group>
        <GroupTitle>Referenced Topics:</GroupTitle>
        <GroupList>
          {data.referenced.map(key => {
            const thumbProps = {
              ...props,
              key,
              refKey: key,
              refType: 'referenced'
            };
            return <ReferenceTopicThumbnail {...thumbProps} />;
          })}
        </GroupList>
      </Group>
    );

  const currentThumbProps = {
    ...props,
    refKey: topicKey
  };
  const currentTopic = (
    <Group>
      <GroupTitle>Current Topic:</GroupTitle>
      <GroupList>
        <ReferenceTopicThumbnail {...currentThumbProps} />
      </GroupList>
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
