import { FocusMode, OpType } from '@blink-mind/core';
import { BaseProps, PropKey } from '@blink-mind/renderer-react';
import * as React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  margin: 10px;
`;

const Content = styled.div`
  max-width: 3rem;
  text-decoration: underline;
  cursor: pointer;
`;

export function ReferenceTopicThumbnail(
  props: BaseProps & { refKey: KeyType }
) {
  const { controller, refKey } = props;
  const onClick = e => {
    e.stopPropagation();
    controller.run('operation', {
      ...props,
      opArray: [
        {
          opType: OpType.FOCUS_TOPIC,
          topicKey: refKey,
          focusMode: FocusMode.NORMAL
        },
        {
          opType: OpType.EXPAND_TO,
          topicKey: refKey
        }
      ]
    });
    setTimeout(() => {
      controller.run('moveTopicToCenter', { ...props, topicKey: refKey });
    });
  };
  let content = controller.getValue(PropKey.TOPIC_TITLE, {
    ...props,
    topicKey: refKey
  });
  content = content.length < 97 ? content : content.substr(0, 97) + '...';
  return (
    <Root onClick={onClick}>
      <Content>{content}</Content>
    </Root>
  );
}
