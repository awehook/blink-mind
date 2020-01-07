import * as React from 'react';
import { TagEditor } from './tag-editor';

export function TagsPlugin() {
  return {
    renderRightTopPanelTabs(props, next) {
      const res = next();
      res.push(<TagEditor {...props} />);
    }
  };
}
