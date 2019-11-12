import { ReactPlugin } from './react';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { StylePlugin } from './style';
import { EventPlugin } from './event';
import { HotKeyPlugin } from './hotkey';
import { DragAndDrop } from './drag-and-drop';

export function DefaultPlugin() {
  return [
    ReactPlugin(),
    LayoutPlugin(),
    OperationPlugin(),
    StylePlugin(),
    EventPlugin(),
    HotKeyPlugin(),
    DragAndDrop()
  ];
}
