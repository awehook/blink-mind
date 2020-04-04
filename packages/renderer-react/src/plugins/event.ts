import { FocusMode, OpType } from '@blink-mind/core';

import debug from 'debug';

const log = debug('plugin:event');

export function EventPlugin() {
  const eventListeners = {};
  let _isHandlingMouseMove = false;
  return {
    isHandlingMouseMove(ctx) {
      return _isHandlingMouseMove;
    },

    setHandlingMouseMove(v) {
      _isHandlingMouseMove = v;
    },

    handleTopicClick(props) {
      log('handleTopicClick');
      const { controller, model, topicKey } = props;
      log(model.zoomFactor);
      //TODO
      if (model.editingDescKey !== null) return;
      if (model.editingContentKey === topicKey) return;
      if (
        model.focusKey === topicKey &&
        (model.focusMode === FocusMode.EDITING_CONTENT ||
          model.focusMode === FocusMode.NORMAL)
      )
        return;
      controller.run('operation', {
        ...props,
        opType: OpType.FOCUS_TOPIC,
        focusMode: FocusMode.NORMAL
      });
    },

    handleTopicDoubleClick(props) {
      const { controller, model } = props;
      if (model.editingDescKey !== null) return;
      controller.run('operation', {
        ...props,
        opType: OpType.FOCUS_TOPIC,
        focusMode: FocusMode.EDITING_CONTENT
      });
    },

    handleTopicContextMenu(props) {
      const { controller } = props;
      controller.run('operation', {
        ...props,
        opType: OpType.FOCUS_TOPIC,
        focusMode: FocusMode.SHOW_POPUP
      });
    },

    handleDialogClose(props) {},

    addEventListener(props) {
      const { key, listener, once, controller } = props;
      if (!eventListeners[key]) eventListeners[key] = [];
      if (once) {
        only.origin = listener;
        eventListeners[key].push(only);
      } else {
        eventListeners[key].push(listener);
      }

      function only() {
        listener();
        controller.run('removeEventListener', {
          key,
          listener
        });
      }
    },

    removeEventListener(props) {
      const { key, listener } = props;
      if (eventListeners[key]) {
        eventListeners[key] = eventListeners[key].filter(fn => {
          return fn !== listener && fn.origin !== listener;
        });
      }
    },

    fireEvent(props) {
      const { key } = props;
      if (eventListeners[key]) {
        eventListeners[key].forEach(fn => fn());
      }
    }
  };
}
