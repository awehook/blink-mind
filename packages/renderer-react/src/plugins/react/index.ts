import { ContextMenuPlugin } from './context-menu';
import { DragAndDropPlugin } from './drag-and-drop';
import { RenderingPlugin } from './rendering';
import { UtilsPlugin } from './utils';

export function ReactPlugin(options = {}) {
  return [
    RenderingPlugin(),
    UtilsPlugin(),
    ContextMenuPlugin(),
    DragAndDropPlugin()
  ];
}
