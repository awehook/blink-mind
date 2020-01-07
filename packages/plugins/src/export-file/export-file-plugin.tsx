import { ToolbarItemConfigs } from '@blink-mind/renderer-react';
import { ToolbarItemExport } from './toolbar-item-export';

export function ExportFilePlugin() {
  return {
    customizeToolbar(props, next): ToolbarItemConfigs {
      const res: ToolbarItemConfigs = next();
      res.push({
        order: 20,
        element: ToolbarItemExport
      });
      return res;
    }
  };
}
