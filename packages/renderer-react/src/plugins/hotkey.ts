import { OpType } from '@blink-mind/core';

export interface HotKeyConfig {
  combo: string;
  onKeyDown: Function;
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
    customizeHotKeys(props) {
      const handleKeyDown = opType => e => {
        // log('HotKeyPlugin', opType);
        op(opType, props);
      };
      const hotKeyMap = new Map<string, HotKeyConfig>([
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
      return hotKeyMap;
    }
  };
}
