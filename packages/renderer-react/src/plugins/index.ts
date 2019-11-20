import { ReactPlugin } from './react';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { StylePlugin } from './style';
import { EventPlugin } from './event';
import { HotKeyPlugin } from './hotkey';
import { DragAndDrop } from './drag-and-drop';
import SimpleTextEditorPlugin from '@blink-mind/plugin-simple-text-editor';

export function DefaultPlugin() {
  return [
    ReactPlugin(),
    LayoutPlugin(),
    OperationPlugin(),
    StylePlugin(),
    EventPlugin(),
    HotKeyPlugin(),
    DragAndDrop(),
    SimpleTextEditorPlugin()
  ];
}
