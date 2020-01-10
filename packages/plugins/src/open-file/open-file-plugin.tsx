import { ToolbarItemConfigs } from '@blink-mind/renderer-react';
import { ToolbarItemOpenFile } from './toolbar-item-openfile';

export function OpenFilePlugin() {
  return {
    customizeToolbar(props, next): ToolbarItemConfigs {
      const res: ToolbarItemConfigs = next();
      res.push({
        order: 10,
        element: ToolbarItemOpenFile
      });
      return res;
    }
  };
}
