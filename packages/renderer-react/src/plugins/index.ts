import { ReactPlugin } from './react';
import { LayoutPlugin } from './layout';
import { OperationPlugin } from './operation';
import { StylePlugin } from './style';

export function DefaultPlugin() {
  const reactPlugin = ReactPlugin();
  const layoutPlugin = LayoutPlugin();
  const operationPlugin = OperationPlugin();
  const stylePlugin = StylePlugin();
  return [reactPlugin, layoutPlugin, operationPlugin, stylePlugin];
}
