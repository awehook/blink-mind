import { ElementItemConfigs } from '@blink-mind/renderer-react';
import { ToolbarItemOpenFile } from './toolbar-item-openfile';

export function OpenFilePlugin() {
  return {
    customizeToolbar(props, next): ElementItemConfigs {
      const res: ElementItemConfigs = next();
      res.push({
        order: 10,
        element: ToolbarItemOpenFile
      });
      return res;
    }
  };
}
