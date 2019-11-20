import { RenderingPlugin } from './rendering';

export function ReactPlugin(options = {}) {
  return [RenderingPlugin()];
}
