import { OpType } from '@blink-mind/core';
import {
  BaseProps,
  Btn,
  getI18nText,
  I18nKey,
  Icon,
  IconName
} from '@blink-mind/renderer-react';
import { Alert, Classes, Position, Tooltip } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { Topology } from 'topology-core';
import { BLOCK_TYPE_TOPOLOGY, REF_KEY_TOPOLOGY_DIAGRAM } from './utils';

const Root = styled.div`
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

const ZoomFactorSpan = styled.span`
  display: inline-block;
  width: 80px;
  height: 18px;
`;
interface State {
  deleteConfirm: boolean;
  canvasData: any;
}

export class TopologyDiagramUtils extends React.Component<BaseProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      deleteConfirm: false,
      canvasData: null
    };
  }

  setCanvasData = canvasData => {
    this.setState({ canvasData });
  };

  getTopology(): Topology {
    const { getRef } = this.props;
    return getRef(REF_KEY_TOPOLOGY_DIAGRAM).topology;
  }

  onClickResetZoom = e => {
    const topology = this.getTopology();
    topology.scaleTo(1);
  };

  render() {
    const props = this.props;
    const { controller } = props;

    const onClickDelete = e => {
      this.setState({ deleteConfirm: true });
    };
    const deleteAlertProps = {
      isOpen: this.state.deleteConfirm,
      cancelButtonText: getI18nText(props,I18nKey.CANCEL),
      confirmButtonText: getI18nText(props,I18nKey.CONFIRM),
      onConfirm: e => {
        controller.run('operation', {
          ...props,
          opType: OpType.DELETE_TOPIC_BLOCK,
          blockType: BLOCK_TYPE_TOPOLOGY
        });
      },
      onCancel: e => {
        this.setState({ deleteConfirm: false });
      },
      onClose: e => {
        this.setState({ deleteConfirm: false });
      }
    };
    const { canvasData } = this.state;
    const scale = canvasData ? canvasData.scale : 1;
    return (
      <Root>
        <Item
          onClick={this.onClickResetZoom}
          tooltip={getI18nText(props, I18nKey.RESET_ZOOM)}
        >
          <ZoomFactorSpan>{`${getI18nText(props, I18nKey.ZOOM)}:${Math.floor(
            scale * 100
          )}%`}</ZoomFactorSpan>
        </Item>
        <Item
          onClick={onClickDelete}
          tooltip={getI18nText(props, I18nKey.DELETE)}
        >
          {Icon(IconName.TRASH)}
        </Item>
        <Alert {...deleteAlertProps}>
          <p>{getI18nText(props,I18nKey.DELETE_TOPOLOGY_TIP)}</p>
        </Alert>
      </Root>
    );
  }
}
