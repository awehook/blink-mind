import { RenderingPlugin } from './rendering';
import { UtilsPlugin } from './utils';

export function ReactPlugin(options = {}) {
  return [RenderingPlugin(), UtilsPlugin()];
}
