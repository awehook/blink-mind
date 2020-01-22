import {
  cancelEvent,
  getI18nText,
  I18nKey,
  Icon
} from '@blink-mind/renderer-react';
import { Drawer } from '@blueprintjs/core';
import * as React from 'react';
import { TopologyDiagram } from './topology-diagram';

import { FocusMode, OpType } from '@blink-mind/core';
import styled from 'styled-components';
import { TopologyDiagramUtils } from './topology-diagram-utils';
import {
  BLOCK_TYPE_TOPOLOGY,
  REF_KEY_TOPOLOGY_DIAGRAM,
  REF_KEY_TOPOLOGY_DIAGRAM_UTIL
} from './utils';

const DiagramWrapper = styled.div`
  position: relative;
  overflow: auto;
  padding: 0px 0px 0px 5px;
  background: #88888850;
  height: 100%;
`;

const Title = styled.span`
  padding: 0px 20px;
`;

export function TopologyDrawer(props) {
  const { controller, topicKey, getRef, saveRef } = props;
  const onDiagramClose = e => {
    e.stopPropagation();
    // const key = `topic-topology-data-${topicKey}`;
    // const topologyData = controller.run('deleteTempValue', { key });

    const diagram: TopologyDiagram = getRef(REF_KEY_TOPOLOGY_DIAGRAM);
    const topologyData = diagram.topology.data;
    controller.run('operation', {
      ...props,
      opType: OpType.SET_TOPIC_BLOCK,
      topicKey,
      blockType: BLOCK_TYPE_TOPOLOGY,
      data: topologyData,
      focusMode: FocusMode.NORMAL
    });
  };
  const diagramProps = {
    ...props,
    ref: saveRef(REF_KEY_TOPOLOGY_DIAGRAM)
  };
  const utilProps = {
    ...props,
    ref: saveRef(REF_KEY_TOPOLOGY_DIAGRAM_UTIL)
  };
  return (
    <Drawer
      title={
        <Title>{getI18nText(props, I18nKey.TOPOLOGY_DIAGRAM_EDITOR)}</Title>
      }
      icon={Icon('topology')}
      isOpen
      hasBackdrop
      backdropClassName="backdrop"
      backdropProps={{ onMouseDown: cancelEvent }}
      canOutsideClickClose={false}
      isCloseButtonShown={true}
      onClose={onDiagramClose}
      size="100%"
    >
      <DiagramWrapper onClick={cancelEvent} onDoubleClick={cancelEvent}>
        <TopologyDiagram {...diagramProps} />
        <TopologyDiagramUtils {...utilProps} />
      </DiagramWrapper>
    </Drawer>
  );
}
