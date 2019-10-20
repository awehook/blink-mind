import { Model } from './models/model';
import { CorePlugin } from './plugins/core';
import { CommandsPlugin } from './plugins/commands';
import { IDiagram, IControllerOption } from './interfaces';

import debug from 'debug';

const log = debug('core:controller');

function registerPlugin(controller: Controller, plugin: any) {
  if (Array.isArray(plugin)) {
    plugin.forEach(p => registerPlugin(controller, p));
    return;
  }

  if (plugin == null) {
    return;
  }

  const { commands, ...rest } = plugin;

  if (commands) {
    const commandsPlugin = CommandsPlugin(commands);
    registerPlugin(controller, commandsPlugin);
  }

  for (const key in rest) {
    const fn = rest[key];
    controller.middleware[key] = controller.middleware[key] || [];
    controller.middleware[key].push(fn);
  }
}

export class Controller {
  diagram: IDiagram;
  middleware: Map<string, any[]>;
  readOnly: boolean;

  constructor(options: IControllerOption = {}) {
    const {
      diagram = this,
      construct = true,
      plugins = [],
      readOnly = false,
      model = Model.create()
    } = options;

    this.diagram = diagram;
    this.middleware = new Map();
    const corePlugin = CorePlugin({ plugins });
    registerPlugin(this, corePlugin);

    if (construct) {
      this.run('onConstruct');
      this.setReadOnly(readOnly);
      this.setModel(model, options);
    }
  }

  run(key: string, ...args: any[]) {
    log('run:', ...args);
    const { diagram, middleware } = this;
    const fns = middleware[key] || [];
    let i = 0;

    function next(...overrides) {
      const fn = fns[i++];
      if (!fn) return;

      if (overrides.length) {
        args = overrides;
      }

      const ret = fn(...args, diagram, next);
      return ret;
    }

    return next();
  }

  command(type, ...args) {
    const { diagram } = this;
    log('command', { type, args });
    const obj = { type, args };
    this.run('onCommand', obj);
    return diagram;
  }

  registerCommand(type: string) {
    const { diagram } = this;
  }

  setReadOnly(readOnly) {
    this.readOnly = readOnly;
    return this;
  }

  setModel(model: Model, options) {
    return this;
  }
}
