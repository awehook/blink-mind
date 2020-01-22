import { FocusMode, OpType } from '@blink-mind/core';
import { Flex, getI18nText, I18nKey, ZIndex } from '@blink-mind/renderer-react';
import { Button } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { OP_TYPE_SET_REFERENCE_TOPICS } from './utils';

const Root = styled(ZIndex)`
  position: absolute;
  left: calc(50% - 150px);
  top: 30px;
  width: 300px;
  background: white;
  padding: 10px;
  user-select: none;
`;

const Title = styled.div`
  margin-bottom: 10px;
`;

export function AddReferenceTopicPanel(props) {
  const { zIndex, controller, topicKey } = props;
  const onClickCancel = e => {
    controller.run('clearSelectedReferenceKeys', props);
    controller.run('enableOperation', props);
    controller.run('operation', {
      ...props,
      opType: OpType.SET_FOCUS_MODE,
      focusMode: FocusMode.NORMAL
    });
  };
  const onClickConfirm = e => {
    const referenceKeys = controller.run('getSelectedReferenceKeys', props);
    controller.run('enableOperation', props);
    controller.run('operation', {
      ...props,
      opArray: [
        {
          opType: OP_TYPE_SET_REFERENCE_TOPICS,
          topicKey,
          referenceKeys
        },
        {
          opType: OpType.FOCUS_TOPIC,
          topicKey,
          focusMode: FocusMode.NORMAL
        }
      ],
      allowUndo: false
    });
    controller.run('clearSelectedReferenceKeys', props);
  };
  return (
    <Root zIndex={zIndex}>
      <Title>{getI18nText(props, I18nKey.SELECT_REF_TOPICS_TIP)}</Title>
      <Flex justifyContent={'space-around'}>
        <Button onClick={onClickConfirm}>
          {getI18nText(props, I18nKey.CONFIRM)}
        </Button>
        <Button onClick={onClickCancel}>
          {getI18nText(props, I18nKey.CANCEL)}
        </Button>
      </Flex>
    </Root>
  );
}
