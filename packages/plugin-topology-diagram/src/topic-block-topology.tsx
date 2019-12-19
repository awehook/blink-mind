import { FocusMode, OpType } from '@blink-mind/core';
import {
  cancelEvent,
  Icon,
  iconClassName,
  IconName,
  TopicBlockIcon
} from '@blink-mind/renderer-react';
import { Drawer } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { TopologyDiagram } from './topology-diagram';
import {
  BLOCK_TYPE_TOPOLOGY,
  FOCUS_MODE_EDITING_TOPOLOGY,
  OP_TYPE_START_EDITING_TOPOLOGY
} from './utils';

const DiagramWrapper = styled.div`
  overflow: auto;
  padding: 0px 0px 0px 20px;
  background: #88888850;
  height: 100%;
`;

const Title = styled.span`
  padding: 0px 20px;
`;

export function TopicBlockTopology(props) {
  const { controller, model, topicKey, getRef } = props;
  const onClick = e => {
    e.stopPropagation();
    controller.run('operation', {
      ...props,
      opType: OP_TYPE_START_EDITING_TOPOLOGY
    });
  };
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
  const isEditing =
    model.focusKey === topicKey &&
    model.focusMode === FOCUS_MODE_EDITING_TOPOLOGY;

  const { block } = model.getTopic(topicKey).getBlock(BLOCK_TYPE_TOPOLOGY);

  if (!isEditing && !block) return null;
  const iconProps = {
    className: iconClassName('topology'),
    onClick,
    tabIndex: -1
  };

  const cancel = e => {
    e.stopPropagation();
  };
  const icon = <TopicBlockIcon {...iconProps} />;
  return (
    <>
      {icon}
      <Drawer
        title={<Title>Topology Diagram Editor</Title>}
        icon={Icon('topology')}
        isOpen={isEditing}
        hasBackdrop
        backdropClassName="backdrop"
        backdropProps={{ onMouseDown: cancel }}
        canOutsideClickClose={false}
        isCloseButtonShown={true}
        onClose={onDiagramClose}
        size="90%"
      >
        <DiagramWrapper onClick={cancelEvent} onDoubleClick={cancelEvent}>
          <TopologyDiagram {...props} />
        </DiagramWrapper>
      </Drawer>
    </>
  );
}
