import { BlockType, OpType } from '@blink-mind/core';

import { ViewModeMindMap } from '@blink-mind/core';
import { IHotkeyProps } from '@blueprintjs/core';
import { HotKeyName, HotKeysConfig } from '../types';

function op(opType: string, props) {
  const { topicKey, controller } = props;
  if (topicKey === undefined) {
    props = { ...props, topicKey: controller.model.focusKey };
  }
  controller.run('operation', { ...props, opType });
}

export function HotKeyPlugin() {
  return {
    customizeHotKeys(ctx): HotKeysConfig {
      const { controller } = ctx;
      const model = controller.model;
      const handleHotKeyDown = (opType, opArg?) => e => {
        // log('HotKeyPlugin', opType);
        op(opType, { ...ctx, ...opArg });
        e.stopImmediatePropagation();
        e.preventDefault();
      };
      const topicHotKeys = new Map<string, IHotkeyProps>([
        [
          HotKeyName.SWAP_UP,
          {
            label: 'swap up',
            combo: 'mod + up',
            allowInInput: true,
            preventDefault: true,
            stopPropagation: true,
            onKeyDown: handleHotKeyDown(OpType.SWAP_UP)
          }
        ],
        [
          HotKeyName.SWAP_DOWN,
          {
            label: 'swap down',
            combo: 'mod + down',
            allowInInput: true,
            preventDefault: true,
            stopPropagation: true,
            onKeyDown: handleHotKeyDown(OpType.SWAP_DOWN)
          }
        ],
        [
          HotKeyName.DELETE_TOPIC,
          {
            label: 'delete topic',
            combo: 'del',
            allowInInput: true,
            preventDefault: true,
            stopPropagation: true,
            onKeyDown: handleHotKeyDown(OpType.DELETE_TOPIC)
          }
        ],

        [
          HotKeyName.EDIT_NOTES,
          {
            label: 'edit notes',
            combo: 'alt + d',
            allowInInput: true,
            onKeyDown: handleHotKeyDown(OpType.START_EDITING_DESC)
          }
        ],
        [
          HotKeyName.SET_EDITOR_ROOT,
          {
            label: 'set editor root',
            combo: 'alt + f',
            allowInInput: true,
            onKeyDown: handleHotKeyDown(OpType.SET_EDITOR_ROOT)
          }
        ]
      ]);
      const topic = model.currentFocusTopic;
      if (topic && topic.getBlock(BlockType.DESC).block)
        topicHotKeys.set(HotKeyName.DELETE_NOTES, {
          label: 'delete notes',
          combo: 'alt + shift + d',
          allowInInput: true,
          onKeyDown: handleHotKeyDown(OpType.DELETE_TOPIC_BLOCK, {
            blockType: BlockType.DESC
          })
        });
      const globalHotKeys = new Map<string, IHotkeyProps>();
      const viewModeTopicHotKeys = new Map();
      const viewModeMindMapTopicHotKeys = new Map<string, IHotkeyProps>([
        [
          HotKeyName.ADD_SIBLING,
          {
            label: 'add sibling',
            combo: 'enter',
            onKeyDown: handleHotKeyDown(OpType.ADD_SIBLING)
          }
        ],
        [
          HotKeyName.EDIT_CONTENT,
          {
            label: 'edit content',
            combo: 'space',
            onKeyDown: handleHotKeyDown(OpType.START_EDITING_CONTENT)
          }
        ],
        [
          HotKeyName.ADD_CHILD,
          {
            label: 'add child',
            combo: 'tab',
            allowInInput: true,
            preventDefault: true,
            stopPropagation: true,
            onKeyDown: handleHotKeyDown(OpType.ADD_CHILD)
          }
        ]
      ]);
      viewModeTopicHotKeys.set(ViewModeMindMap, viewModeMindMapTopicHotKeys);
      return {
        topicHotKeys,
        globalHotKeys,
        viewModeTopicHotKeys
      };
    }
  };
}
