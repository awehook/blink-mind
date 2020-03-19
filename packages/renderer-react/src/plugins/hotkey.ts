import { OpType, BlockType } from '@blink-mind/core';

import { HotKeyItem, HotKeyName, HotKeysConfig } from '../types';

function op(opType: string, props) {
  const { topicKey, model, controller } = props;
  if (topicKey === undefined) {
    props = { ...props, topicKey: model.focusKey };
  }
  controller.run('operation', { ...props, opType });
}

export function HotKeyPlugin() {
  return {
    customizeHotKeys(ctx): HotKeysConfig {
      const { model } = ctx;
      const handleHotKeyDown = (opType, opArg?) => e => {
        // log('HotKeyPlugin', opType);
        op(opType, { ...ctx, ...opArg });
        e.stopImmediatePropagation();
        e.preventDefault();
      };
      const topicHotKeys = new Map<string, HotKeyItem>([
        [
          HotKeyName.ADD_CHILD,
          {
            label: 'add child',
            combo: 'tab',
            onKeyDown: handleHotKeyDown(OpType.ADD_CHILD)
          }
        ],
        [
          HotKeyName.ADD_SIBLING,
          {
            label: 'add sibling',
            combo: 'enter',
            onKeyDown: handleHotKeyDown(OpType.ADD_SIBLING)
          }
        ],
        [
          HotKeyName.DELETE_TOPIC,
          {
            label: 'delete topic',
            combo: 'del',
            onKeyDown: handleHotKeyDown(OpType.DELETE_TOPIC)
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
          HotKeyName.EDIT_NOTES,
          {
            label: 'edit notes',
            combo: 'alt + d',
            onKeyDown: handleHotKeyDown(OpType.START_EDITING_DESC)
          }
        ],
        [
          HotKeyName.SET_EDITOR_ROOT,
          {
            label: 'set editor root',
            combo: 'alt + f',
            onKeyDown: handleHotKeyDown(OpType.SET_EDITOR_ROOT)
          }
        ]
      ]);
      const topic = model.currentFocusTopic;
      if (topic && topic.getBlock(BlockType.DESC).block)
        topicHotKeys.set(HotKeyName.DELETE_NOTES, {
          label: 'delete notes',
          combo: 'alt + shift + d',
          onKeyDown: handleHotKeyDown(OpType.DELETE_TOPIC_BLOCK, {
            blockType: BlockType.DESC
          })
        });
      const globalHotKeys = new Map();
      return {
        topicHotKeys,
        globalHotKeys
      };
    }
  };
}
