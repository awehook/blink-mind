import { KeyType } from '@blink-mind/core';
import {
  Alert,
  BaseProps,
  getI18nText,
  I18nKey,
  PropKey
} from '@blink-mind/renderer-react';
import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

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
  removeHandler?: (event: React.MouseEvent<HTMLElement>) => void;
};
export function ReferenceTopicThumbnail(props: ReferenceTopicThumbnailProps) {
  const { controller, refKey, refType, removeHandler } = props;
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const onClick = e => {
    e.stopPropagation();
    controller.run('focusTopicAndMoveToCenter', { ...props, topicKey: refKey });
  };

  const onClickRemove = e => {
    setDeleteConfirm(true);
  };

  const content = controller.getValue(PropKey.TOPIC_TITLE, {
    ...props,
    topicKey: refKey,
    maxLength: 100
  });
  const deleteAlertProps = {
    ...props,
    isOpen: deleteConfirm,
    content: getI18nText(props, I18nKey.DELETE_REFERENCE_TIP),
    onConfirm: e => {
      removeHandler(e);
    },
    onCancel: e => {
      setDeleteConfirm(false);
    }
  };
  return (
    <Root>
      <Content onClick={onClick}>{content}</Content>
      <ButtonPlace>
        {refType === 'reference' && (
          <>
            <Button onClick={onClickRemove}>
              {getI18nText(props, I18nKey.REMOVE)}
            </Button>
            <Alert {...deleteAlertProps} />
          </>
        )}
      </ButtonPlace>
    </Root>
  );
}
