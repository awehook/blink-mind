import { OpType } from '@blink-mind/core';
import { Classes, Position, Tooltip } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { BaseWidget, Btn } from '../../../../components/common';
import {
  EventKey,
  getRelativeVector,
  Icon,
  IconName,
  RefKey,
  topicRefKey
} from '../../../../utils';

const log = debug('node:view-port-viewer');

const ViewerRoot = styled.div`
  position: absolute;
  background: white;
  right: 30px;
  bottom: 20px;
  border-radius: 2px;
  z-index: 3;
  display: flex;
  flex-direction: row;
  user-select: none;
`;

const Item_ = styled(Btn)`
  margin: 10px;
`;

const ZoomFactorSpan = styled.span`
  display: inline-block;
  width: 80px;
  height: 18px;
`;

const Item = props => {
  return (
    <Tooltip
      content={props.tooltip}
      position={Position.TOP}
      className={Classes.ICON}
    >
      <Item_ onClick={props.onClick}>{props.children}</Item_>
    </Tooltip>
  );
};

export class ViewPortViewer extends BaseWidget {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    const props = this.props;
    const { controller } = props;
    controller.run('addZoomFactorChangeEventListener', {
      ...props,
      listener: this.zoomFactorChange
    });
  }

  componentWillUnmount(): void {
    const props = this.props;
    const { controller } = props;
    controller.run('removeZoomFactorChangeEventListener', {
      ...props,
      listener: this.zoomFactorChange
    });
  }

  zoomFactorChange = zoomFactor => {
    log('zoomFactorChange', zoomFactor);
    this.setState({ zoomFactor });
  };

  onClickResetZoom = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: 1
    });
  };

  onClickAddZoom = e => {
    const props = this.props;
    const { controller } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: zoomFactor + 0.1
    });
  };

  onClickMinusZoom = e => {
    const props = this.props;
    const { controller } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: zoomFactor - 0.1
    });
  };

  onClickCollapseAll = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('addEventListener', {
      ...props,
      key: EventKey.CENTER_ROOT_TOPIC,
      listener: this.centerRootTopic,
      once: true
    });
    controller.run('operation', {
      ...props,
      opType: OpType.COLLAPSE_ALL
    });
  };

  onClickExpandAll = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('addEventListener', {
      ...props,
      key: EventKey.CENTER_ROOT_TOPIC,
      listener: this.centerRootTopic,
      once: true
    });
    controller.run('operation', {
      ...props,
      opType: OpType.EXPAND_ALL
    });
  };

  centerRootTopic = () => {
    const { getRef, model, controller } = this.props;
    const rootTopic = getRef(topicRefKey(model.editorRootTopicKey));
    const dragScroll = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY);
    const viewBox = dragScroll.viewBox;
    const vector = getRelativeVector(rootTopic, viewBox);
    //TODO
    dragScroll.setViewBoxScrollDelta(vector[0], vector[1]);
  };

  render() {
    log('render');
    const props = this.props;
    const { controller } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    return (
      <ViewerRoot>
        <Item onClick={this.onClickCollapseAll} tooltip="collapse all">
          {Icon(IconName.COLLAPSE_ALL)}
        </Item>
        <Item onClick={this.onClickExpandAll} tooltip="expand all">
          {Icon(IconName.EXPAND_ALL)}
        </Item>
        <Item onClick={this.centerRootTopic} tooltip="center root topic">
          {Icon(IconName.CENTER)}
        </Item>
        <Item onClick={this.onClickMinusZoom} tooltip="zoom in">
          {Icon(IconName.MINUS)}
        </Item>
        <Item onClick={this.onClickResetZoom} tooltip="reset zoom">
          <ZoomFactorSpan>{`zoom:${Math.floor(
            zoomFactor * 100
          )}%`}</ZoomFactorSpan>
        </Item>
        <Item onClick={this.onClickAddZoom} tooltip="zoom out">
          {Icon(IconName.PLUS)}
        </Item>
      </ViewerRoot>
    );
  }
}
