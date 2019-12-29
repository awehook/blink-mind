import { cancelEvent } from '@blink-mind/renderer-react';
import * as React from 'react';
import styled from 'styled-components';
import { ReferenceTopicRecord } from './reference-topic-record';
import { ReferenceTopicThumbnail } from './reference-topic-thumbnail';
const Root = styled.div`
  padding: 15px;
`;
const GroupTitle = styled.div``;
export function ReferenceTopicList(props) {
  const { block } = props;
  const data: ReferenceTopicRecord = block.data;
  const referenceGroup =
    data.reference.size === 0 ? null : (
      <>
        <GroupTitle>reference topics:</GroupTitle>
        {data.reference.map(key => {
          const thumbProps = {
            ...props,
            key,
            refKey: key
          };
          return <ReferenceTopicThumbnail {...thumbProps} />;
        })}
      </>
    );

  const referencedGroup =
    data.referenced.size === 0 ? null : (
      <>
        <GroupTitle>referenced topics:</GroupTitle>
        {data.referenced.map(key => {
          const thumbProps = {
            ...props,
            key,
            refKey: key
          };
          return <ReferenceTopicThumbnail {...thumbProps} />;
        })}
      </>
    );

  return (
    <Root onMouseDown={cancelEvent}>
      {referenceGroup}
      {referencedGroup}
    </Root>
  );
}
