import { FocusMode, OpType, TopicDirection } from '@blink-mind/core';
import { ContextMenuTarget } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { collapseRefKey, contentRefKey, PropKey } from '../../utils';
import { BaseProps, BaseWidget } from '../common';

const log = debug('node:topic-content-widget');

interface TopicContentProps {
  dragEnter?: boolean;
}

const TopicContent = styled.div<TopicContentProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  //overflow: hidden;
  position: relative;
`;

const TopicContentWithDropArea = styled.div`
  position: relative;
`;

interface Props extends BaseProps {
  draggable: boolean;
}

interface State {
  dragEnter: boolean;
}

@ContextMenuTarget
export class TopicContentWidget extends BaseWidget<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      dragEnter: false
    };
  }

  onDragStart = ev => {
    this.run('handleTopicDragStart', { ...this.props, ev });
  };

  onDragOver = ev => {
    // log('onDragOver');
    ev.preventDefault();
  };

  onDragEnter = ev => {
    log('onDragEnter', this.props.topicKey);
    this.run('handleTopicDragEnter', { ...this.props, ev, dropDir: 'in' });
  };

  onDragLeave = ev => {
    this.run('handleTopicDragLeave', { ...this.props, ev, dropDir: 'in' });
  };

  onDrop = ev => {
    log('onDrop');
    this.run('handleTopicDrop', { ...this.props, ev, dropDir: 'in' });
  };

  public renderContextMenu() {
    const { controller } = this.props;
    if (
      !controller.getValue(PropKey.TOPIC_CONTEXT_MENU_ENABLED, {
        ...this.props
      })
    ) {
      return;
    }
    this.operation(OpType.FOCUS_TOPIC, {
      ...this.props,
      focusMode: FocusMode.SHOW_POPUP
    });
    return controller.run('renderTopicContextMenu', this.props);
  }

  public onContextMenuClose() {
    // Optional method called once the context menu is closed.
  }

  handleTopicClickTimeout;

  onClick = ev => {
    const props = this.props;
    const { controller } = props;
    //TODO bug [Violation] 'setTimeout' handler took 69ms
    this.handleTopicClickTimeout = setTimeout(() => {
      // log('handleTopicClick');
      //注意这里要传递this.props, 而不是props, 因为会先调用onClick, 再调用其他的topic-content-editor的onClickOutside
      //其他组件的onClickOutside是个同步的函数,会设置新的model, 如果这里用props传参,会导致model 还是老的model
      controller.run('handleTopicClick', { ...this.props, ev });
    }, 200);
  };

  onDoubleClick = ev => {
    clearTimeout(this.handleTopicClickTimeout);
    const { controller } = this.props;
    controller.run('handleTopicDoubleClick', { ...this.props, ev });
  };

  needRelocation: boolean = false;
  oldCollapseIconVector;

  componentDidUpdate() {
    if (this.needRelocation) {
      const { getRef, topicKey, setViewBoxScrollDelta } = this.props;
      const newIcon = getRef(collapseRefKey(topicKey));
      const newRect = newIcon.getBoundingClientRect();
      // const newVector = controller.run('getRelativeVectorFromViewPort', {
      //   ...this.props,
      //   element: getRef(collapseRefKey(topicKey))
      // });
      const newVector = [
        newRect.left + newRect.width / 2,
        newRect.top + newRect.height / 2
      ];
      log('newVector:', newVector);
      log('oldVector:', this.oldCollapseIconVector);
      //TODO bug
      const vector = [
        newVector[0] - this.oldCollapseIconVector[0],
        newVector[1] - this.oldCollapseIconVector[1]
      ];
      log('vector', vector);
      setViewBoxScrollDelta(vector[0], vector[1]);
      this.needRelocation = false;
    }
  }

  onClickCollapse = e => {
    e.stopPropagation();
    const { topicKey, getRef } = this.props;
    this.needRelocation = true;
    const collapseIcon = getRef(collapseRefKey(topicKey));
    const rect = collapseIcon.getBoundingClientRect();
    log('oldRect', rect);
    this.oldCollapseIconVector = [
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    ];
    log('oldCollapseIconVector', this.oldCollapseIconVector);
    // this.oldCollapseIconVector = controller.run('getRelativeVectorFromViewPort', {
    //   ...this.props,
    //   element: collapseIcon
    // });
    this.operation(OpType.TOGGLE_COLLAPSE, this.props);
  };

  render() {
    const props = this.props;
    const { saveRef, topicKey, model, controller, topicStyle, dir } = props;
    log('render', topicKey, model.focusMode);
    const draggable =
      controller.run('isOperationEnabled', props) &&
      model.editingContentKey !== topicKey;
    const collapseIcon = controller.run('renderTopicCollapseIcon', {
      ...props,
      onClickCollapse: this.onClickCollapse.bind(this)
    });
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
    // log(topicKey, 'style', topicStyle);
    return (
      <TopicContentWithDropArea>
        {prevDropArea}
        <TopicContent
          style={topicStyle}
          draggable={draggable}
          ref={saveRef(contentRefKey(topicKey))}
          onDragStart={this.onDragStart}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}
          {...dropEventHandlers}
        >
          {controller.run('renderTopicBlocks', props)}
          {controller.run('renderTopicContentOthers', props)}
        </TopicContent>
        {nextDropArea}
        {dir !== TopicDirection.MAIN && collapseIcon}
      </TopicContentWithDropArea>
    );
  }
}
