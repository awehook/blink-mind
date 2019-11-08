export function CorePlugin(options: any = {}) {
  const { plugins = [] } = options;
  return [...plugins];
}
