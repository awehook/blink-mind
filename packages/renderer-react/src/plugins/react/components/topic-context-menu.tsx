import * as React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { OpType } from '../../operation';

import debug from 'debug';
import { BaseProps } from '../../../components/base-props';
import { BaseWidget } from '../../../components/common';
import { Icon } from '../../../utils';
const log = debug('node:popup-menu');

export type TopicContextMenuItemConfig = {
  icon?: string;
  label?: string;
  opType?: string;
  rootCanUse?: boolean;
  hotKey?: string;
};

interface Props extends BaseProps {
  items: TopicContextMenuItemConfig[];
}

export class TopicContextMenu extends BaseWidget<Props> {
  static defaultProps = {
    items: [
      {
        icon: 'edit',
        label: 'edit',
        rootCanUse: true,
        opType: OpType.START_EDITING_CONTENT
      },
      {
        icon: 'add-sibling',
        label: 'add sibling',
        opType: OpType.ADD_SIBLING
      },
      {
        icon: 'add-child',
        label: 'add child',
        rootCanUse: true,
        opType: OpType.ADD_CHILD
      },
      {
        icon: 'notes',
        label: 'edit notes',
        opType: OpType.START_EDITING_DESC
      },
      {
        icon: 'delete-node',
        label: 'delete node',
        opType: OpType.DELETE_TOPIC
      }
    ]
  };

  onClickItem(item: TopicContextMenuItemConfig) {
    return function(e) {
      item.opType && this.operation(item.opType, this.props);
    };
  }

  render() {
    const { items, topicKey, model } = this.props;
    const isRoot = topicKey === model.editorRootTopicKey;
    return (
      <Menu>
        {items.map(item =>
          isRoot && !item.rootCanUse ? null : (
            <MenuItem
              key={item.label}
              icon={Icon(item.icon)}
              text={item.label}
              onClick={this.onClickItem(item).bind(this)}
            />
          )
        )}
      </Menu>
    );
  }
}
