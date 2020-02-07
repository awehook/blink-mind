import { CanvasPlugin } from './canvas';
import { ContextMenuPlugin } from './context-menu';
import { DragAndDropPlugin } from './drag-and-drop';
import { RenderingPlugin } from './rendering';
import { RightTopPanelPlugin } from './right-top-panel-plugin';
import { ToolbarPlugin } from './toolbar';
import { LinkLinePlugin } from './link-line';
import { UtilsPlugin } from './utils';

export function ReactPlugin(options = {}) {
  return [
    RenderingPlugin(),
    UtilsPlugin(),
    ContextMenuPlugin(),
    RightTopPanelPlugin(),
    ToolbarPlugin(),
    DragAndDropPlugin(),
    CanvasPlugin(),
    LinkLinePlugin()
  ];
}
