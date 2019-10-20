import { RenderingPlugin } from './rendering';

export function ReactPlugin(options = {}) {
  const renderingPlugin = RenderingPlugin();

  return [renderingPlugin];
}
