import React from 'react';
import styled from 'styled-components';
import { useClickOutside } from '../../hooks';
import { FocusMode, OpType } from '../../../../core/src/types';

const EditingRoot = styled.div`
  position: relative;
  padding: 5px;
`;

const cancelEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};
export function TopicContent(props) {
  const { controller, model, topicKey } = props;
  const readOnly = model.editingContentKey !== topicKey;
  const ref = useClickOutside(() => {
    if(!readOnly) {
      console.log('onClickOutSide');
      controller.run('operation', {
        ...props,
        opType: OpType.SET_FOCUS_MODE,
        focusMode: FocusMode.NORMAL
      });
    }
  });
  const editor = controller.run('renderTopicContentEditor', {
    ...props,
    readOnly
  });
  return (
    <EditingRoot ref={ref} onDragEnter={cancelEvent} onDragOver={cancelEvent}>
      {editor}
    </EditingRoot>
  );
}
