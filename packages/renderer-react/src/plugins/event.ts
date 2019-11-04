import { OpType } from './operation';
import { FocusMode } from '@blink-mind/core/src/types';

import debug from 'debug';

const log = debug('plugin:event');

export function EventPlugin() {
  return {
    handleTopicClick(props) {
      const { controller } = props;
      controller.run('operation', {
        ...props,
        opType: OpType.FOCUS_TOPIC,
        focusMode: FocusMode.NORMAL
      });
    },

    handleDoubleClickTopic(props) {},

    handleTopicContextMenu(props) {
      const { controller } = props;
      controller.run('operation', {
        ...props,
        opType: OpType.FOCUS_TOPIC,
        focusMode: FocusMode.SHOW_POPUP
      });
    }
  };
}
