import SimpleTextEditorPlugin from '@blink-mind/plugin-simple-text-editor';
import { EventPlugin } from './event';
import { GetValuePlugin } from './get-value';
import { HotKeyPlugin } from './hotkey';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { ReactPlugin } from './react';
import { StylePlugin } from './style';

export * from './hotkey';

export function DefaultPlugin() {
  return [
    ReactPlugin(),
    LayoutPlugin(),
    OperationPlugin(),
    StylePlugin(),
    EventPlugin(),
    HotKeyPlugin(),
    GetValuePlugin(),
    SimpleTextEditorPlugin()
  ];
}
