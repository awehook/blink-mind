import { ReactPlugin } from './react';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { StylePlugin } from './style';
import { EventPlugin } from './event';

export function DefaultPlugin() {
  const reactPlugin = ReactPlugin();
  const layoutPlugin = LayoutPlugin();
  const operationPlugin = OperationPlugin();
  const stylePlugin = StylePlugin();
  const eventPlugin = EventPlugin();
  return [reactPlugin, layoutPlugin, operationPlugin, stylePlugin, eventPlugin];
}
