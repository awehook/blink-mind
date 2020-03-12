import React from 'react';
import styled from 'styled-components';
import { useClickOutside } from '../../hooks';
import { FocusMode, OpType } from '@blink-mind/core';
import { Key } from 'ts-keycode-enum';

const EditingRoot = styled.div`
  position: relative;
  padding: 5px;
`;

const cancelEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};
export function TopicContent(props) {
  const { controller, model, topic, topicKey } = props;
  const readOnly = model.editingContentKey !== topicKey;
  const ref = useClickOutside(() => {
    if (!readOnly) {
      console.log('onClickOutSide');
      controller.run('operation', {
        ...props,
        opType: OpType.SET_FOCUS_MODE,
        focusMode: FocusMode.NORMAL
      });
    }
  });
  const handleKeyDown = e => {
    switch (e.keyCode) {
      case Key.Enter:
        if (!e.shiftKey) {
          controller.run('operation', {
            ...props,
            opType: OpType.ADD_SIBLING
          });
          return true;
        }
        break;
      case Key.Tab:
        controller.run('operation', {
          ...props,
          opType: OpType.ADD_CHILD
        });
        return true;
    }
    return false;
  };

  const editor = controller.run('renderTopicContentEditor', {
    ...props,
    readOnly,
    handleKeyDown
  });
  return (
    <EditingRoot ref={ref} onDragEnter={cancelEvent} onDragOver={cancelEvent}>
      {editor}
    </EditingRoot>
  );
}
