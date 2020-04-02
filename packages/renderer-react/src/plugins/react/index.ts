import { ContextMenuPlugin } from './context-menu';
import { DragAndDropPlugin } from './drag-and-drop';
import { LinkLinePlugin } from './link-line';
import { RenderingPlugin } from './rendering';
import { RightTopPanelPlugin } from './right-top-panel-plugin';
import { SheetPlugin } from './sheet';
import { ToolbarPlugin } from './toolbar';
import { UtilsPlugin } from './utils';
import { PastePlugin } from './paste';
import { DialogPlugin } from './dialog';

export function ReactPlugin(options = {}) {
  return [
    RenderingPlugin(),
    UtilsPlugin(),
    PastePlugin(),
    ContextMenuPlugin(),
    RightTopPanelPlugin(),
    ToolbarPlugin(),
    DragAndDropPlugin(),
    SheetPlugin(),
    LinkLinePlugin(),
    DialogPlugin()
  ];
}
