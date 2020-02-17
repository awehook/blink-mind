import { OpType } from '@blink-mind/core';
import { ElementItemConfigs, HotKeysConfig } from '@blink-mind/renderer-react';
import * as React from 'react';
import { SearchPanel } from './search-panel';
import { ToolbarItemSearch } from './toolbar-item-search';
import { FOCUS_MODE_SEARCH, HOT_KEY_NAME_SEARCH } from './utils';

export function SearchPlugin() {
  return {
    customizeHotKeys(props, next): HotKeysConfig {
      const { controller, model } = props;
      const hotKeys: HotKeysConfig = next();

      hotKeys.globalHotKeys.set(HOT_KEY_NAME_SEARCH, {
        label: 'search',
        combo: 'mod + f',
        onKeyDown: () => {
          controller.run('operation', {
            ...props,
            opType: OpType.FOCUS_TOPIC,
            topicKey: model.focusKey,
            focusMode: FOCUS_MODE_SEARCH
          });
        }
      });
      return hotKeys;
    },

    customizeToolbar(props, next): ElementItemConfigs {
      const res: ElementItemConfigs = next();
      res.push({
        order: 300,
        element: ToolbarItemSearch
      });
      return res;
    },

    renderSheetCustomize(props, next) {
      const res = next();
      const { model } = props;
      if (model.focusMode === FOCUS_MODE_SEARCH) {
        const searchPanelProps = {
          key: 'search-panel',
          ...props,
        };
        res.push(<SearchPanel {...searchPanelProps} />);
      }
      return res;
    }
  };
}
