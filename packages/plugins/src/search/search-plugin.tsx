import { OpType } from '@blink-mind/core';
import { HotKeyMap } from '@blink-mind/renderer-react';
import * as React from 'react';
import { SearchPanel } from './search-panel';
import { FOCUS_MODE_SEARCH, HOT_KEY_NAME_SEARCH } from './utils';

export function SearchPlugin() {
  let searchWord: string;
  const setSearchWorld = s => {
    searchWord = s;
  };
  return {
    customizeHotKeys(props, next) {
      const { controller, model } = props;
      const hotKeyMap: HotKeyMap = next();

      hotKeyMap.set(HOT_KEY_NAME_SEARCH, {
        combo: 'ctrl + shift + f',
        onKeyDown: () => {
          controller.run('operation', {
            ...props,
            opType: OpType.FOCUS_TOPIC,
            topicKey: model.focusKey,
            focusMode: FOCUS_MODE_SEARCH
          });
        }
      });
      return hotKeyMap;
    },

    renderDiagramCustomize(props, next) {
      const res = next();
      const { model } = props;
      if (model.focusMode === FOCUS_MODE_SEARCH) {
        const searchPanelProps = {
          key: 'search-panel',
          ...props,
          setSearchWorld
        };
        res.push(<SearchPanel {...searchPanelProps} />);
      }
      return res;
    }
  };
}
