import * as React from 'react';
import styled from 'styled-components';
import {
  Controller,
  Model,
  TopicDirection,
  KeyType,
  TopicVisualLevel
} from '@blink-mind/core';
import { BaseProps } from '../../../components/BaseProps';
import debug from 'debug';
import { ThemeType } from '@blink-mind/core/src/configs/theme';
import { BaseWidget } from '../../../components/common';
import { FocusMode } from '@blink-mind/core/src/types';
import { OpType } from '../../operation';

const log = debug('node:topic-content-widget');

function getTopicTheme(visualLevel: number, theme: ThemeType) {
  if (visualLevel === TopicVisualLevel.ROOT) return theme.rootTopic;
  if (visualLevel === TopicVisualLevel.PRIMARY) return theme.primaryTopic;
  return theme.normalTopic;
}

const DropArea = styled.div`
  height: 20px;
  width: 100%;
`;

interface TopicContentProps {
  dragEnter?: boolean;
}

const TopicContent = styled.div<TopicContentProps>`
  display: flex;
  align-items: center;
  word-wrap: break-word;
  white-space: pre-line;
  cursor: pointer;
  overflow: hidden;
`;

interface Props extends BaseProps {
  draggable: boolean;
}

interface State {
  dragEnter: boolean;
  showPopMenu: boolean;
}

let dragSrcItemKey: KeyType = null;

export class TopicContentWidget extends BaseWidget<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      dragEnter: false,
      showPopMenu: false
    };
  }

  onDragStart = e => {
    log('onDragStart');
    dragSrcItemKey = this.props.topicKey;
    e.stopPropagation();
  };

  onDragOver = e => {
    e.preventDefault();
  };

  onDragEnter = e => {};

  onDragLeave = e => {};

  onDrop = e => {
    log('onDrop');
  };

  isDoubleClick: boolean;

  onClick = e => {
    this.isDoubleClick = false;
    log(e.nativeEvent);
    setTimeout(() => {
      if (!this.isDoubleClick) {
        this.operation(OpType.FOCUS_TOPIC, {
          ...this.props,
          focusMode: FocusMode.NORMAL
        });
      }
    });
  };

  onDoubleClick = () => {
    this.isDoubleClick = true;
  };

  onContextMenu = e => {
    log(e);
    this.operation(OpType.FOCUS_TOPIC, {
      ...this.props,
      focusMode: FocusMode.SHOW_POPUP
    });
    this.setState({
      showPopMenu: true
    });
  };

  handlePopMenuVisibleChange = visible => {
    this.setState({
      showPopMenu: visible
    });
  };

  render() {
    const props = this.props;
    const { draggable, saveRef, topicKey, controller, topicStyle } = props;
    const showPopMenu = this.state.showPopMenu;
    log(topicStyle);
    return (
      <div>
        <DropArea />
        <TopicContent
          // theme={getTopicTheme(visualLevel, model.config.theme)}
          // dragEnter={this.state.dragEnter}
          style={topicStyle}
          draggable={draggable}
          ref={saveRef(`content-${topicKey}`)}
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}
          onContextMenu={this.onContextMenu}
        >
          {controller.run('renderBlocks', { props })}
          {showPopMenu &&
            controller.run('renderTopicPopupMenu', {
              ...props,
              handleVisibleChange: this.handlePopMenuVisibleChange,
              visible: true
            })}
        </TopicContent>
        <DropArea />
      </div>
    );
  }
}
