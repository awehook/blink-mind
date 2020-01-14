import { Controller, FocusMode, Model } from '@blink-mind/core';
import { HotKeysConfig } from '../../types';
import { Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { EventKey, RefKey, topicRefKey } from '../../utils';
import { DragScrollWidget } from '../common';
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

@HotkeysTarget
export class MindDragScrollWidget<
  P extends MindDragScrollWidgetProps
> extends React.PureComponent<MindDragScrollWidgetProps> {
  constructor(props: MindDragScrollWidgetProps) {
    super(props);
  }

  renderHotkeys() {
    const props = this.props;
    const { controller, model } = props;
    const hotKeys: HotKeysConfig = controller.run('customizeHotKeys', props);
    if (hotKeys === null) return null;
    if (
      !(
        hotKeys.topicHotKeys instanceof Map &&
        hotKeys.globalHotKeys instanceof Map
      )
    ) {
      throw new TypeError('topicHotKeys and globalHotKeys must be a Map');
    }
    const children = [];
    if (
      model.focusMode === FocusMode.NORMAL ||
      model.focusMode === FocusMode.SHOW_POPUP
    ) {
      hotKeys.topicHotKeys.forEach((v, k) => {
        children.push(<Hotkey key={k} {...v} global />);
      });
    }
    hotKeys.globalHotKeys.forEach((v, k) => {
      children.push(<Hotkey key={k} {...v} global />);
    });
    return <Hotkeys>{children}</Hotkeys>;
  }

  componentDidMount(): void {
    const { getRef, model, controller } = this.props;
    controller.run('addZoomFactorChangeEventListener', {
      ...this.props,
      listener: this.setZoomFactor
    });
    const rootTopic: HTMLElement = getRef(
      topicRefKey(model.editorRootTopicKey)
    );
    //TODO
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
    this.layout();
  }

  componentWillUnmount(): void {
    const { controller } = this.props;
    controller.run('removeZoomFactorChangeEventListener', {
      ...this.props,
      listener: this.setZoomFactor
    });
  }

  get dragScrollWidget(): DragScrollWidget {
    return this.props.getRef(RefKey.DRAG_SCROLL_WIDGET_KEY);
  }

  componentDidUpdate(): void {
    const { controller } = this.props;
    controller.run('fireEvent', {
      ...this.props,
      key: EventKey.CENTER_ROOT_TOPIC
    });
    this.layout();
  }

  layout() {
    const { controller } = this.props;
    controller.run('layout', this.props);
  }

  setZoomFactor = zoomFactor => {
    this.dragScrollWidget.setZoomFactor(zoomFactor);
  };

  onWheel = e => {
    if (e.altKey || e.ctrlKey) {
      const { controller } = this.props;
      let zoomFactor = controller.run('getZoomFactor', this.props);
      zoomFactor = zoomFactor - (e.nativeEvent.deltaY > 0 ? 0.1 : -0.1);
      if (zoomFactor < 0.5) zoomFactor = 0.5;
      if (zoomFactor > 4) zoomFactor = 4;
      // console.log('zoomFactor=>', zoomFactor);
      controller.run('setZoomFactor', { ...this.props, zoomFactor });
    }
  };

  render() {
    const { saveRef, model, controller } = this.props;
    const nodeKey = model.editorRootTopicKey;
    return (
      <DIV onWheel={this.onWheel}>
        <DragScrollWidget
          {...this.state}
          enableMouseWheel={false}
          zoomFactor={model.zoomFactor}
          ref={saveRef(RefKey.DRAG_SCROLL_WIDGET_KEY)}
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
