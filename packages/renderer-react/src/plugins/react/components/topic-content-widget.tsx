import * as React from 'react';
import styled from 'styled-components';
import { ContextMenuTarget } from '@blueprintjs/core';
import { TopicDirection, KeyType, TopicVisualLevel } from '@blink-mind/core';
import { BaseProps } from '../../../components/base-props';
import debug from 'debug';
import { BaseWidget } from '../../../components/common';
import { OpType } from '../../operation';
import { collapseRefKey, contentRefKey } from '../../../utils';

const log = debug('node:topic-content-widget');

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

const TopicContentWithDropArea = styled.div`
  position: relative;
`;

interface Props extends BaseProps {
  draggable: boolean;
}

interface State {
  dragEnter: boolean;
  showPopMenu: boolean;
}

@ContextMenuTarget
export class TopicContentWidget extends BaseWidget<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      dragEnter: false,
      showPopMenu: false
    };
  }

  onDragStart = ev => {
    this.run('handleTopicDragStart', { ...this.props, ev });
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDragEnter = ev => {
    this.run('handleTopicDragEnter', { ...this.props, ev, dropDir: 'in' });
  };

  onDragLeave = ev => {
    this.run('handleTopicDragLeave', { ...this.props, ev, dropDir: 'in' });
  };

  onDrop = ev => {
    this.run('handleTopicDrop', { ...this.props, ev, dropDir: 'in' });
  };

  public renderContextMenu() {
    const { controller } = this.props;
    return controller.run('renderTopicContextMenu', this.props);
  }

  public onContextMenuClose() {
    // Optional method called once the context menu is closed.
  }

  isDoubleClick: boolean;

  onClick = ev => {
    this.isDoubleClick = false;
    log(ev.nativeEvent);
    const props = this.props;
    const { controller } = props;
    setTimeout(() => {
      if (!this.isDoubleClick) {
        controller.run('handleTopicClick', { ...props, ev });
      }
    });
  };

  onDoubleClick = ev => {
    this.isDoubleClick = true;
    const { controller } = this.props;
    controller.run('handleTopicDoubleClick', { ...this.props, ev });
  };

  onContextMenu = ev => {
    const { controller } = this.props;
    controller.run('handleTopicContextMenu', { ...this.props, ev });
    this.setState({
      showPopMenu: true
    });
  };

  handlePopMenuVisibleChange = visible => {
    this.setState({
      showPopMenu: visible
    });
  };

  needRelocation: boolean = false;
  oldCollapseIconRect: ClientRect;

  componentDidUpdate() {
    if (this.needRelocation) {
      const { getRef, topicKey, setViewBoxScrollDelta } = this.props;
      const newRect = getRef(collapseRefKey(topicKey)).getBoundingClientRect();
      log('newRect:', newRect);
      log('oldRect:', this.oldCollapseIconRect);
      setViewBoxScrollDelta(
        newRect.left - this.oldCollapseIconRect.left,
        newRect.top - this.oldCollapseIconRect.top
      );
      this.needRelocation = false;
    }
  }

  onClickCollapse = e => {
    e.stopPropagation();
    const { topicKey, getRef } = this.props;
    this.needRelocation = true;
    this.oldCollapseIconRect = getRef(
      collapseRefKey(topicKey)
    ).getBoundingClientRect();
    this.operation(OpType.TOGGLE_COLLAPSE, this.props);
  };

  render() {
    const props = this.props;
    const { saveRef, topicKey, model, controller, topicStyle, dir } = props;
    const draggable = model.editingContentKey !== topicKey;
    const showPopMenu = this.state.showPopMenu;
    const collapseIcon = controller.run('renderTopicCollapseIcon', {
      ...props,
      onClickCollapse: this.onClickCollapse.bind(this)
    });
    log(dir);
    const prevDropArea = controller.run('renderTopicDropArea', {
      ...props,
      dropDir: 'prev'
    });
    const nextDropArea = controller.run('renderTopicDropArea', {
      ...props,
      dropDir: 'next'
    });
    const dropEventHandlers = {
      onDragEnter: this.onDragEnter,
      onDragLeave: this.onDragLeave,
      onDragOver: this.onDragOver,
      onDrop: this.onDrop
    };
    return (
      <TopicContentWithDropArea>
        {prevDropArea}
        <TopicContent
          // theme={getTopicTheme(visualLevel, model.config.theme)}
          // dragEnter={this.state.dragEnter}
          style={topicStyle}
          draggable={draggable}
          ref={saveRef(contentRefKey(topicKey))}
          onDragStart={this.onDragStart}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}
          onContextMenu={this.onContextMenu}
          {...dropEventHandlers}
        >
          {controller.run('renderBlocks', props)}
          {showPopMenu &&
            controller.run('renderTopicPopupMenu', {
              ...props,
              handleVisibleChange: this.handlePopMenuVisibleChange,
              visible: true
            })}
        </TopicContent>
        {nextDropArea}
        {dir !== TopicDirection.MAIN && collapseIcon}
      </TopicContentWithDropArea>
    );
  }
}
