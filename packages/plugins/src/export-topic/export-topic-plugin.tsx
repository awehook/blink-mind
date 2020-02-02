import * as React from 'react';
import { ContextMenuExportTopic } from './context-menu-export-topic';

export function ExportTopicPlugin() {
  return {
    customizeTopicContextMenu(ctx, next) {
      const res = next();
      res.push(<ContextMenuExportTopic {...ctx} />);
      return res;
    }
  };
}
