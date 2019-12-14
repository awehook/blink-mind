import { Controller, Model } from '@blink-mind/core';
import * as React from 'react';
import styled from 'styled-components';
import { DragScrollWidget } from '../../../components/common';
import { topicRefKey } from '../../../utils';
const NodeLayer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px;
`;

const DIV = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.background};
`;

export interface MindDragScrollWidgetProps {
  controller: Controller;
  model: Model;
  saveRef?: Function;
  getRef?: Function;
}

export class MindDragScrollWidget<
  P extends MindDragScrollWidgetProps
> extends React.Component<MindDragScrollWidgetProps> {
  constructor(props: MindDragScrollWidgetProps) {
    super(props);
  }

  componentDidMount(): void {
    const { getRef, model } = this.props;
    const rootTopic: HTMLElement = getRef(
      topicRefKey(model.editorRootTopicKey)
    );
    const nodeLayer: HTMLElement = getRef('node-layer');
    const rootTopicRect = rootTopic.getBoundingClientRect();
    const nodeLayerRect = nodeLayer.getBoundingClientRect();
    this.dragScrollWidget.setViewBoxScrollDelta(
      0,
      rootTopicRect.top -
        nodeLayerRect.top -
        this.dragScrollWidget.viewBox.getBoundingClientRect().height / 2 +
        rootTopicRect.height
    );
  }

  get dragScrollWidget(): DragScrollWidget {
    return this.props.getRef('DragScrollWidget');
  }

  onClick = e => {};

  onWheel = e => {
    if (e.altKey || e.ctrlKey) {
      const { model, controller } = this.props;
      let { zoomFactor } = model;
      zoomFactor = zoomFactor - e.nativeEvent.deltaY / 500;
      if (zoomFactor < 0.5) zoomFactor = 0.5;
      if (zoomFactor > 8) zoomFactor = 8;
      // console.log('zoomFactor=>', zoomFactor);
      controller.run('setZoomFactor', { ...this.props, zoomFactor });
      this.dragScrollWidget.setZoomFactor(zoomFactor);
    }
  };

  shouldComponentUpdate(nextProps: Readonly<MindDragScrollWidgetProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    if(nextProps.model.zoomFactor !== this.props.model.zoomFactor)
      return false;
    return true;
  }

  render() {
    const { saveRef, model, controller } = this.props;
    const nodeKey = model.editorRootTopicKey;
    return (
      <DIV
        // onClick={this.onClick}
        onWheel={this.onWheel}
      >
        <DragScrollWidget
          {...this.state}
          enableMouseWheel={false}
          zoomFactor={model.zoomFactor}
          ref={saveRef('DragScrollWidget')}
        >
          {(
            setViewBoxScroll: (left: number, top: number) => void,
            setViewBoxScrollDelta: (left: number, top: number) => void
          ) => {
            const rootWidgetProps = {
              ...this.props,
              topicKey: nodeKey,
              setViewBoxScroll,
              setViewBoxScrollDelta
            };
            return (
              <NodeLayer ref={saveRef('node-layer')}>
                {controller.run('renderRootWidget', rootWidgetProps)}
              </NodeLayer>
            );
          }}
        </DragScrollWidget>
      </DIV>
    );
  }
}
