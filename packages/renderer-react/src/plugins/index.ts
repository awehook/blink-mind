import { CreateModelPlugin } from './create-model';
import { EventPlugin } from './event';
import { GetValuePlugin } from './get-value';
import { HotKeyPlugin } from './hotkey';
import { I18nPlugin } from './i18n';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { OptmizationPlugin } from './optimization';
import { PlatformPlugin } from './platform';
import { ReactPlugin } from './react';
import { StylePlugin } from './style';
import { ThemePlugin } from './theme';
import { TopicContentEditorPlugin } from './topic-content-editor';
import { UndoPlugin } from './undo';

export function DefaultPlugin() {
  return [
    ReactPlugin(),
    LayoutPlugin(),
    OperationPlugin(),
    UndoPlugin(),
    StylePlugin(),
    EventPlugin(),
    HotKeyPlugin(),
    GetValuePlugin(),
    TopicContentEditorPlugin(),
    CreateModelPlugin(),
    ThemePlugin(),
    PlatformPlugin(),
    I18nPlugin(),
    OptmizationPlugin()
  ];
}
