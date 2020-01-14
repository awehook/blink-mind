import { CreateModelPlugin } from './create-model';
import { EventPlugin } from './event';
import { GetValuePlugin } from './get-value';
import { HotKeyPlugin } from './hotkey';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { ReactPlugin } from './react';
import { SimpleTextEditorPlugin } from './simple-text-editor';
import { StylePlugin } from './style';
import { ThemePlugin } from './theme';

export function DefaultPlugin() {
  return [
    ReactPlugin(),
    LayoutPlugin(),
    OperationPlugin(),
    StylePlugin(),
    EventPlugin(),
    HotKeyPlugin(),
    GetValuePlugin(),
    SimpleTextEditorPlugin(),
    CreateModelPlugin(),
    ThemePlugin()
  ];
}
