import { BaseProps, BaseWidget } from '@blink-mind/renderer-react';
import * as React from 'react';
import { Topology } from 'topology-core';
import { registerNode } from 'topology-core/middles';
import { Options } from 'topology-core/options';

import {
  flowComment,
  flowCommentAnchors,
  flowData,
  flowDataAnchors,
  flowDataIconRect,
  flowDataTextRect,
  flowDb,
  flowDbIconRect,
  flowDbTextRect,
  flowDisplay,
  flowDisplayAnchors,
  flowDisplayIconRect,
  flowDisplayTextRect,
  flowDocument,
  flowDocumentAnchors,
  flowDocumentIconRect,
  flowDocumentTextRect,
  flowExternStorage,
  flowExternStorageAnchors,
  flowExternStorageIconRect,
  flowExternStorageTextRect,
  flowInternalStorage,
  flowInternalStorageIconRect,
  flowInternalStorageTextRect,
  flowManually,
  flowManuallyAnchors,
  flowManuallyIconRect,
  flowManuallyTextRect,
  flowParallel,
  flowParallelAnchors,
  flowQueue,
  flowQueueIconRect,
  flowQueueTextRect,
  flowSubprocess,
  flowSubprocessIconRect,
  flowSubprocessTextRect
} from 'topology-flow-diagram';
import { ToolsConfig } from './tools-config';

import '@blink-mind/icons/iconfont/topology';
import styled from 'styled-components';
import {
  activityFinal,
  activityFinalIconRect,
  activityFinalTextRect,
  fork,
  forkHAnchors,
  forkIconRect,
  forkTextRect,
  forkVAnchors,
  swimlaneH,
  swimlaneHIconRect,
  swimlaneHTextRect,
  swimlaneV,
  swimlaneVIconRect,
  swimlaneVTextRect
} from 'topology-activity-diagram';
import {
  interfaceClass,
  interfaceClassIconRect,
  interfaceClassTextRect,
  simpleClass,
  simpleClassIconRect,
  simpleClassTextRect
} from 'topology-class-diagram';
import {
  lifeline,
  lifelineAnchors,
  lifelineIconRect,
  lifelineTextRect,
  sequenceFocus,
  sequenceFocusAnchors,
  sequenceFocusIconRect,
  sequenceFocusTextRect
} from 'topology-sequence-diagram';
import { TopologyDiagramUtils } from './topology-diagram-utils';
import { BLOCK_TYPE_TOPOLOGY, REF_KEY_TOPOLOGY_DIAGRAM_UTIL } from './utils';

const Root = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.div`
  flex: 1;
  width: initial;
  position: relative;
  overflow: auto;
  background: #fff;
`;

const Tools = styled.div`
  flex-shrink: 0;
  width: 1.75rem;
  background-color: #f8f8f8;
  border-right: 1px solid #d9d9d9;
  overflow-y: auto;
`;

const ToolTitle = styled.div`
  color: #0d1a26;
  font-weight: 600;
  font-size: 0.12rem;
  padding: 0.05rem 0.1rem;
  margin-top: 0.08rem;
  border-bottom: 1px solid #ddd;

  &:first-child {
    border-top: none;
  }
`;

const ToolbarButtons = styled.div`
  padding: 0.1rem 0;
  a {
    display: inline-block;
    color: @text-color;
    line-height: 1;
    width: 0.4rem;
    height: 0.4rem;
    text-align: center;
    text-decoration: none !important;

    .iconfont {
      font-size: 0.24rem;
    }
  }
`;

interface IState {
  id: string;
  data: any;
  toolsConfig: any[];
}

export class TopologyDiagram extends BaseWidget<BaseProps, IState> {
  state: IState = {
    id: '',
    data: null,
    toolsConfig: ToolsConfig
  };
  iconfont: { fontSize: '0.24rem' };
  topology: Topology;

  canvasOptions: Options = {};

  canvasRegister() {
    registerNode(
      'flowData',
      flowData,
      flowDataAnchors,
      flowDataIconRect,
      flowDataTextRect
    );
    registerNode(
      'flowSubprocess',
      flowSubprocess,
      null,
      flowSubprocessIconRect,
      flowSubprocessTextRect
    );
    registerNode('flowDb', flowDb, null, flowDbIconRect, flowDbTextRect);
    registerNode(
      'flowDocument',
      flowDocument,
      flowDocumentAnchors,
      flowDocumentIconRect,
      flowDocumentTextRect
    );
    registerNode(
      'flowInternalStorage',
      flowInternalStorage,
      null,
      flowInternalStorageIconRect,
      flowInternalStorageTextRect
    );
    registerNode(
      'flowExternStorage',
      flowExternStorage,
      flowExternStorageAnchors,
      flowExternStorageIconRect,
      flowExternStorageTextRect
    );
    registerNode(
      'flowQueue',
      flowQueue,
      null,
      flowQueueIconRect,
      flowQueueTextRect
    );
    registerNode(
      'flowManually',
      flowManually,
      flowManuallyAnchors,
      flowManuallyIconRect,
      flowManuallyTextRect
    );
    registerNode(
      'flowDisplay',
      flowDisplay,
      flowDisplayAnchors,
      flowDisplayIconRect,
      flowDisplayTextRect
    );
    registerNode('flowParallel', flowParallel, flowParallelAnchors, null, null);
    registerNode('flowComment', flowComment, flowCommentAnchors, null, null);

    // activity
    registerNode(
      'activityFinal',
      activityFinal,
      null,
      activityFinalIconRect,
      activityFinalTextRect
    );
    registerNode(
      'swimlaneV',
      swimlaneV,
      null,
      swimlaneVIconRect,
      swimlaneVTextRect
    );
    registerNode(
      'swimlaneH',
      swimlaneH,
      null,
      swimlaneHIconRect,
      swimlaneHTextRect
    );
    registerNode('forkH', fork, forkHAnchors, forkIconRect, forkTextRect);
    registerNode('forkV', fork, forkVAnchors, forkIconRect, forkTextRect);

    // class
    registerNode(
      'simpleClass',
      simpleClass,
      null,
      simpleClassIconRect,
      simpleClassTextRect
    );
    registerNode(
      'interfaceClass',
      interfaceClass,
      null,
      interfaceClassIconRect,
      interfaceClassTextRect
    );

    // sequence
    registerNode(
      'lifeline',
      lifeline,
      lifelineAnchors,
      lifelineIconRect,
      lifelineTextRect
    );
    registerNode(
      'sequenceFocus',
      sequenceFocus,
      sequenceFocusAnchors,
      sequenceFocusIconRect,
      sequenceFocusTextRect
    );
  }

  handleContextMenu = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  onMessage = (event, data) => {
    const { getRef } = this.props;
    const diagramUtil: TopologyDiagramUtils = getRef(
      REF_KEY_TOPOLOGY_DIAGRAM_UTIL
    );
    switch (event) {
      case 'resize':
      case 'scale':
      case 'locked':
        if (this.topology && diagramUtil) {
          diagramUtil.setCanvasData(this.topology.data);
        }
        break;
    }
  };

  componentDidMount(): void {
    this.canvasRegister();
    this.canvasOptions.on = this.onMessage;
    this.topology = new Topology('topology-canvas', this.canvasOptions);
    this.openData();
  }

  componentDidUpdate(): void {
    this.openData();
  }

  openData() {
    const { model, topicKey } = this.props;
    const topic = model.getTopic(topicKey);
    const { block } = topic.getBlock(BLOCK_TYPE_TOPOLOGY);
    if (block && block.data && block.data !== '') {
      this.setState({
        data: block.data
      });
      this.topology.open(block.data);
    }
  }

  onDrag(event: React.DragEvent<HTMLAnchorElement>, node: any) {
    event.dataTransfer.setData('Text', JSON.stringify(node.data));
  }

  renderTools() {
    return (
      <Tools>
        {this.state.toolsConfig.map((item, index) => {
          return (
            <div key={index}>
              <ToolTitle>{item.group}</ToolTitle>
              <ToolbarButtons>
                {//TODO
                //@ts-ignore
                item.children.map((btn, i) => {
                  return (
                    <a
                      key={i}
                      title={btn.name}
                      draggable={true}
                      onDragStart={ev => {
                        this.onDrag(ev, btn);
                      }}
                    >
                      <i
                        className={'iconfont ' + btn.icon}
                        style={this.iconfont}
                      />
                    </a>
                  );
                })}
              </ToolbarButtons>
            </div>
          );
        })}
      </Tools>
    );
  }

  render() {
    return (
      <Root>
        {this.renderTools()}
        <Canvas id="topology-canvas" onContextMenu={this.handleContextMenu} />
      </Root>
    );
  }
}
