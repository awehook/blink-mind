import * as React from 'react';
import { OpType } from '../../operation';
import styled from 'styled-components';
import debug from 'debug';
import { BaseProps } from '../../../components/base-props';
import { BaseWidget } from '../../../components/common';
import {
  TopicPopupMenuItem,
  TopicPopupMenuItemConfig,
  TopicPopupMenuItemType
} from './topic-popup-menu-item';
const log = debug('node:popup-menu');

const PopupMenu = styled.ul`
  position: absolute;
  top: 0;
  left: calc(100% + 5px);
  padding: 5px;
  border-radius: 5px;
  background-color: white;
  color: black;
  //box-shadow: rgb(170, 170, 170) 5px 5px 10px;
  cursor: pointer;
  z-index: 3;
  min-width: 230px;
`;

interface Props extends BaseProps {
  visible: boolean;
  handleVisibleChange: Function;
  items: TopicPopupMenuItemConfig[];
}

export class TopicPopupMenu extends BaseWidget<Props> {
  static defaultProps = {
    items: [
      {
        type: TopicPopupMenuItemType.ITEM,
        icon: 'edit',
        label: 'edit',
        rootCanUse: true,
        opType: OpType.START_EDITING_CONTENT
      },
      {
        type: TopicPopupMenuItemType.ITEM,
        icon: 'add-sibling',
        label: 'add sibling',
        opType: OpType.ADD_SIBLING
      },
      {
        type: TopicPopupMenuItemType.ITEM,
        icon: 'add-child',
        label: 'add child',
        rootCanUse: true,
        opType: OpType.ADD_CHILD
      },
      {
        type: TopicPopupMenuItemType.ITEM,
        icon: 'notes',
        label: 'edit notes',
        opType: OpType.START_EDITING_DESC
      },
      {
        type: TopicPopupMenuItemType.ITEM,
        icon: 'delete-node',
        label: 'delete node',
        opType: OpType.DELETE_TOPIC
      }
    ]
  };
  componentDidMount() {
    document.addEventListener('click', this._handleClick);
    document.addEventListener('contextmenu', this._handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleClick);
    document.removeEventListener('contextmenu', this._handleClick);
  }

  _handleClick = event => {
    log('_handleClick');
    const { visible } = this.props;
    const wasOutside = !(event.target.contains === this.root);

    log(`wasOutside ${wasOutside}`);

    wasOutside &&
      visible &&
      this.props.handleVisibleChange &&
      this.props.handleVisibleChange(false);
  };

  root: HTMLElement;

  rootRef = ref => {
    this.root = ref;
  };

  render() {
    log('render:', this.props.visible);
    const { visible, model, items, topicKey } = this.props;
    const editorRootKey = model.editorRootTopicKey;
    const menuItems = items.map(item => {
      const itemProps = {
        ...this.props,
        config: item,
        key: `${topicKey}-${item.label}`
      };
      return topicKey === editorRootKey && !item.rootCanUse ? null : (
        <TopicPopupMenuItem {...itemProps} />
      );
    });
    return visible && <PopupMenu ref={this.rootRef}>{menuItems}</PopupMenu>;
  }
}
