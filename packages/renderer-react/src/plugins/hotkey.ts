import { OpType } from './operation';

export interface HotKeyConfig {
  combo: string;
  onKeyDown: Function;
}

export const HotKeyName = {
  ADD_CHILD: 'ADD_CHILD',
  ADD_SIBLING: 'ADD_SIBLING',
  DELETE_TOPIC: 'DELETE_TOPIC',
  EDIT_NOTES: 'EDIT_NOTES'
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
    getHotKeys(props) {
      const hotKeyMap = new Map<string, HotKeyConfig>([
        [
          HotKeyName.ADD_CHILD,
          {
            label: 'add child',
            combo: 'tab',
            onKeyDown: e => {
              op(OpType.ADD_CHILD, props);
            }
          }
        ],
        [
          HotKeyName.ADD_SIBLING,
          {
            label: 'add sibling',
            combo: 'enter',
            onKeyDown: e => {
              op(OpType.ADD_SIBLING, props);
            }
          }
        ],
        [
          HotKeyName.DELETE_TOPIC,
          {
            label: 'delete topic',
            combo: 'del',
            onKeyDown: e => {
              op(OpType.DELETE_TOPIC, props);
            }
          }
        ],
        [
          HotKeyName.EDIT_NOTES,
          {
            label: 'edit notes',
            combo: 'alt + d',
            onKeyDown: e => {
              op(OpType.START_EDITING_DESC, props);
            }
          }
        ]
      ]);
      return hotKeyMap;
    }
  };
}
