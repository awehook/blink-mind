import { ElementItemConfigs } from '@blink-mind/renderer-react';
import { ToolbarItemExport } from './toolbar-item-export';

export function ExportFilePlugin() {
  return {
    customizeToolbar(props, next): ElementItemConfigs {
      const res: ElementItemConfigs = next();
      res.push({
        order: 20,
        element: ToolbarItemExport
      });
      return res;
    }
  };
}
