import { CommandsPlugin } from './commands';

export function CorePlugin(options: any = {}) {
  const { plugins = [] } = options;
  const commands = CommandsPlugin({});
  return [...plugins, commands];
}
