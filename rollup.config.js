import configurePackage from './support/rollup/configure-package';

import core from './packages/core/package.json';
import rendererReact from './packages/renderer-react/package.json';
import richTextEditorPlugin from './packages/plugin-rich-text-editor/package.json';

const configs = [
  ...configurePackage(core),
  ...configurePackage(rendererReact),
  ...configurePackage(richTextEditorPlugin)
];

export default configs;
