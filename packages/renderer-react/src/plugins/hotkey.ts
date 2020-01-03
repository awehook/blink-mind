import { OpType } from '@blink-mind/core';

export interface HotKeyItem {
  label: string;
  combo: string;
  onKeyDown: (e: KeyboardEvent) => any;
}

export type HotKeyMap = Map<string, HotKeyItem>;

export interface HotKeysConfig {
  topicHotKeys: HotKeyMap;
  globalHotKeys: HotKeyMap;
}

export const HotKeyName = {
  ADD_CHILD: 'ADD_CHILD',
  ADD_SIBLING: 'ADD_SIBLING',
  DELETE_TOPIC: 'DELETE_TOPIC',
  EDIT_CONTENT: 'EDIT_CONTENT',
  EDIT_NOTES: 'EDIT_NOTES',
  SET_EDITOR_ROOT: 'SET_EDITOR_ROOT'
};

function op(opType: string, props) {
  const { topicKey, model, controller } = props;
  if (topicKey === undefined) {
    props = { ...props, topicKey: model.focusKey };
  }
  controller.run('operation', { ...props, opType });
}

export function HotKeyPlugin() {
  return {
    customizeHotKeys(props): HotKeysConfig {
      const handleKeyDown = opType => e => {
        // log('HotKeyPlugin', opType);
        op(opType, props);
      };
      const topicHotKeys = new Map<string, HotKeyItem>([
        [
          HotKeyName.ADD_CHILD,
          {
            label: 'add child',
            combo: 'tab',
            onKeyDown: handleKeyDown(OpType.ADD_CHILD)
          }
        ],
        [
          HotKeyName.ADD_SIBLING,
          {
            label: 'add sibling',
            combo: 'enter',
            onKeyDown: handleKeyDown(OpType.ADD_SIBLING)
          }
        ],
        [
          HotKeyName.DELETE_TOPIC,
          {
            label: 'delete topic',
            combo: 'del',
            onKeyDown: handleKeyDown(OpType.DELETE_TOPIC)
          }
        ],
        [
          HotKeyName.EDIT_CONTENT,
          {
            label: 'edit content',
            combo: 'space',
            onKeyDown: handleKeyDown(OpType.START_EDITING_CONTENT)
          }
        ],
        [
          HotKeyName.EDIT_NOTES,
          {
            label: 'edit notes',
            combo: 'alt + d',
            onKeyDown: handleKeyDown(OpType.START_EDITING_DESC)
          }
        ],
        [
          HotKeyName.SET_EDITOR_ROOT,
          {
            label: 'set editor root',
            combo: 'alt + shift + f',
            onKeyDown: handleKeyDown(OpType.SET_EDITOR_ROOT)
          }
        ]
      ]);
      const globalHotKeys = new Map();
      return {
        topicHotKeys,
        globalHotKeys
      };
    }
  };
}
