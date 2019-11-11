import { OpType } from '../operation';
import { MenuItem } from '@blueprintjs/core';
import { Icon } from '../../utils';
import * as React from 'react';

export type TopicContextMenuItemConfig = {
  icon?: string;
  label?: string;
  shortcut?: string;
  opType?: string;
  rootCanUse?: boolean;
  hotKey?: string;
};

const items: TopicContextMenuItemConfig[] = [
  {
    icon: 'edit',
    label: 'edit',
    rootCanUse: true,
    opType: OpType.START_EDITING_CONTENT
  },
  {
    icon: 'add-sibling',
    label: 'add sibling',
    shortcut: 'enter',
    opType: OpType.ADD_SIBLING
  },
  {
    icon: 'add-child',
    label: 'add child',
    shortcut: 'Tab',
    rootCanUse: true,
    opType: OpType.ADD_CHILD
  },
  {
    icon: 'notes',
    label: 'edit notes',
    shortcut: 'Alt + D',
    opType: OpType.START_EDITING_DESC
  },
  {
    icon: 'delete-node',
    label: 'delete node',
    shortcut: 'Del',
    opType: OpType.DELETE_TOPIC
  }
];

export function customizeTopicContextMenu(props) {
  const { topicKey, model, controller } = props;
  const isRoot = topicKey === model.editorRootTopicKey;
  function onClickItem(item) {
    return function(e) {
      item.opType &&
        controller.run('operation', { ...props, opType: item.opType });
    };
  }
  return items.map(item =>
    isRoot && !item.rootCanUse ? null : (
      <MenuItem
        key={item.label}
        icon={Icon(item.icon)}
        text={item.label}
        labelElement={<kbd>{item.shortcut}</kbd>}
        onClick={onClickItem(item)}
      />
    )
  );
}
