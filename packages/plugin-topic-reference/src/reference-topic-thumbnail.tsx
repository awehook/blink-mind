import { FocusMode, OpType } from '@blink-mind/core';
import { BaseProps, PropKey } from '@blink-mind/renderer-react';
import { Button } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { OP_TYPE_SET_REFERENCE_TOPICS } from './utils';

const Root = styled.div`
  display: flex;
  width: 380px;
  margin: 10px;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 300px;
  text-decoration: underline;
  cursor: pointer;
`;

const ButtonPlace = styled.div`
  width: 80px;
`;

export type ReferenceTopicThumbnailProps = BaseProps & {
  refKey: KeyType;
  refType: 'reference' | 'referenced' | undefined | null;
  removeHandler: (event: React.MouseEvent<HTMLElement>) => void;
};
export function ReferenceTopicThumbnail(props: ReferenceTopicThumbnailProps) {
  const { controller, refKey, refType, removeHandler } = props;
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
    <Root>
      <Content onClick={onClick}>{content}</Content>
      <ButtonPlace>
        {refType === 'reference' && (
          <Button onClick={removeHandler}>Remove</Button>
        )}
      </ButtonPlace>
    </Root>
  );
}
