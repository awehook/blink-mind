import { CreateModelPlugin } from './create-model';
import { EventPlugin } from './event';
import { GetValuePlugin } from './get-value';
import { HotKeyPlugin } from './hotkey';
import { I18nPlugin } from './i18n';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { PlatformPlugin } from './platform';
import { ReactPlugin } from './react';
import { TopicContentEditorPlugin } from './topic-content-editor';
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
    TopicContentEditorPlugin(),
    CreateModelPlugin(),
    ThemePlugin(),
    PlatformPlugin(),
    I18nPlugin()
  ];
}


