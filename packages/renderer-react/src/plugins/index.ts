import SimpleTextEditorPlugin from '@blink-mind/plugin-simple-text-editor';
import { DragAndDrop } from './drag-and-drop';
import { EventPlugin } from './event';
import { HotKeyPlugin } from './hotkey';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { ReactPlugin } from './react';
import { StylePlugin } from './style';

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
