import { OpType } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { TopicContextMenu } from '../../components/widgets';
import { getI18nText, I18nKey, Icon } from '../../utils';
import { BlockType } from '../../../../core/src/types';

export type TopicContextMenuItemConfig = {
  enabledFunc?: ({ model, topic }) => boolean;
  icon?: string;
  label?: string;
  shortcut?: string;
  opType?: string;
  opArg?: any;
  rootCanUse?: boolean;
  hotKey?: string;
};

const items: TopicContextMenuItemConfig[] = [
  {
    icon: 'edit',
    label: I18nKey.EDIT,
    shortcut: 'Space',
    rootCanUse: true,
    opType: OpType.START_EDITING_CONTENT
  },
  {
    icon: 'add-sibling',
    label: I18nKey.ADD_SIBLING,
    shortcut: 'Enter',
    opType: OpType.ADD_SIBLING
  },
  {
    icon: 'add-child',
    label: I18nKey.ADD_CHILD,
    shortcut: 'Tab',
    rootCanUse: true,
    opType: OpType.ADD_CHILD
  },
  {
    icon: 'notes',
    label: I18nKey.EDIT_NOTES,
    shortcut: 'Alt + D',
    rootCanUse: true,
    opType: OpType.START_EDITING_DESC
  },
  {
    icon: 'trash',
    enabledFunc: ({ topic }) => {
      return topic.getBlock(BlockType.DESC).block != null;
    },
    label: I18nKey.REMOVE_NOTES,
    shortcut: 'Alt + Shift + D',
    rootCanUse: true,
    opType: OpType.DELETE_TOPIC_BLOCK,
    opArg: {
      blockType: BlockType.DESC
    }
  },
  {
    icon: 'delete-node',
    label: I18nKey.DELETE,
    shortcut: 'Del',
    opType: OpType.DELETE_TOPIC
  },
  {
    icon: 'root',
    label: I18nKey.SET_AS_EDITOR_ROOT,
    shortcut: 'Alt + Shift + F',
    opType: OpType.SET_EDITOR_ROOT
  }
];

export function ContextMenuPlugin() {
  return {
    renderTopicContextMenu(props) {
      return <TopicContextMenu {...props} />;
    },
    customizeTopicContextMenu(ctx) {
      const { topicKey, model, controller, topic } = ctx;
      const isRoot = topicKey === model.editorRootTopicKey;
      function onClickItem(item) {
        return function(e) {
          item.opType &&
            controller.run('operation', {
              ...ctx,
              opType: item.opType,
              ...item.opArg
            });
        };
      }
      return items.map(item => {
        if (item.enabledFunc && !item.enabledFunc({ topic, model }))
          return null;
        return isRoot && !item.rootCanUse ? null : (
          <MenuItem
            key={item.label}
            icon={Icon(item.icon)}
            text={getI18nText(ctx, item.label)}
            labelElement={<kbd>{item.shortcut}</kbd>}
            onClick={onClickItem(item)}
          />
        );
      });
    }
  };
}
