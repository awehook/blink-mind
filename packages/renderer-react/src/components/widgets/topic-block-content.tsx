import { FocusMode, OpType } from '@blink-mind/core';
import React from 'react';
import styled from 'styled-components';
import { Key } from 'ts-keycode-enum';
import { useClickOutside } from '../../hooks';

const EditingRoot = styled.div`
  position: relative;
  padding: 5px;
`;

const cancelEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};

// 包裹一层，处理drag事件
export function TopicBlockContent(props) {
  const { controller, model, topic, topicKey } = props;
  const readOnly = model.editingContentKey !== topicKey;
  const ref = useClickOutside(() => {
    if (!readOnly) {
      // console.log('onClickOutSide');
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
            opType: OpType.FOCUS_TOPIC,
            focusMode: FocusMode.NORMAL
          });
          e.nativeEvent.stopImmediatePropagation();
          return true;
        }
        break;
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
