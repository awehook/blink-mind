import { OpType } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { Icon } from '../../utils';

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
    shortcut: 'Space',
    rootCanUse: true,
    opType: OpType.START_EDITING_CONTENT
  },
  {
    icon: 'add-sibling',
    label: 'add sibling',
    shortcut: 'Enter',
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
    rootCanUse: true,
    opType: OpType.START_EDITING_DESC
  },
  {
    icon: 'delete-node',
    label: 'delete node',
    shortcut: 'Del',
    opType: OpType.DELETE_TOPIC
  },
  {
    icon: 'root',
    label: 'set as editor root',
    shortcut: 'Alt + Shift + F',
    opType: OpType.SET_EDITOR_ROOT
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
