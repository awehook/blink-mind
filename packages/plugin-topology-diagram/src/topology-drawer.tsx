import { cancelEvent, Icon } from '@blink-mind/renderer-react';
import { Drawer } from '@blueprintjs/core';
import * as React from 'react';
import { TopologyDiagram } from './topology-diagram';

import { FocusMode, OpType } from '@blink-mind/core';
import styled from 'styled-components';

const DiagramWrapper = styled.div`
  overflow: auto;
  padding: 0px 0px 0px 20px;
  background: #88888850;
  height: 100%;
`;

const Title = styled.span`
  padding: 0px 20px;
`;

export function TopologyDrawer(props) {
  const { controller, model, topicKey, getRef } = props;
  const onDiagramClose = e => {
    e.stopPropagation();
    const key = `topic-topology-data-${topicKey}`;
    const topologyData = controller.run('deleteTempValue', { key });
    controller.run('operation', {
      ...props,
      opType: OpType.SET_TOPIC_BLOCK,
      topicKey,
      data: topologyData,
      focusMode: FocusMode.NORMAL
    });
  };
  return (
    <Drawer
      title={<Title>Topology Diagram Editor</Title>}
      icon={Icon('topology')}
      isOpen
      hasBackdrop
      backdropClassName="backdrop"
      backdropProps={{ onMouseDown: cancelEvent }}
      canOutsideClickClose={false}
      isCloseButtonShown={true}
      onClose={onDiagramClose}
      size="90%"
    >
      <DiagramWrapper onClick={cancelEvent} onDoubleClick={cancelEvent}>
        <TopologyDiagram {...props} />
      </DiagramWrapper>
    </Drawer>
  );
}
