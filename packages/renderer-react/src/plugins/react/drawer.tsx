import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import { Drawer } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import {cancelEvent, getI18nText, I18nKey, Icon} from '../../utils';
const DescEditorWrapper = styled.div`
  overflow: auto;
  padding: 0px 0px 0px 20px;
  background: #88888850;
`;

export function renderDrawer(props) {
  const { controller, model, topicKey } = props;
  if (model.focusMode === FocusMode.EDITING_DESC) {
    const onDescEditorClose = e => {
      e.stopPropagation();
      const key = `topic-desc-data-${topicKey}`;
      const descData = controller.run('deleteTempValue', { key });
      controller.run('operation', {
        ...props,
        opType: OpType.SET_TOPIC_BLOCK,
        topicKey,
        blockType: BlockType.DESC,
        data: descData,
        focusMode: FocusMode.NORMAL
      });
    };
    const descEditor = controller.run('renderTopicDescEditor', props);
    return (
      <Drawer
        key="drawer"
        title={getI18nText(props,I18nKey.EDIT_NOTES)}
        icon={Icon('note')}
        isOpen
        hasBackdrop
        backdropProps={{ onMouseDown: cancelEvent }}
        isCloseButtonShown={false}
        onClose={onDescEditorClose}
        size="70%"
      >
        <DescEditorWrapper>{descEditor}</DescEditorWrapper>
      </Drawer>
    );
  }
}
