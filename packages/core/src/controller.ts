import { Model } from './models';
import { CorePlugin } from './plugins/core';
import { IDiagram, IControllerOption } from './interfaces';
import memoizeOne from 'memoize-one';
import debug from 'debug';
import { OnChangeFunction } from './types';

const log = debug('core:controller');

function registerPlugin(controller: Controller, plugin: any) {
  if (Array.isArray(plugin)) {
    plugin.forEach(p => registerPlugin(controller, p));
    return;
  }

  if (plugin == null) {
    return;
  }

  for (const key in plugin) {
    const fn = plugin[key];
    controller.middleware[key] = controller.middleware[key] || [];
    controller.middleware[key].push(fn);
  }
}

function compose(middleware) {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }

  return function(context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return null;
      try {
        return fn(context, dispatch.bind(null, i + 1));
      } catch (err) {
        return err;
      }
    }
  };
}

export class Controller {
  diagram: IDiagram;
  middleware: Map<string, any[]>;
  onChange: OnChangeFunction;
  readOnly: boolean;

  constructor(options: IControllerOption = {}) {
    const { diagram = this, plugins = [], onChange } = options;

    this.diagram = diagram;
    this.onChange = onChange;
    this.middleware = new Map();
    const corePlugin = CorePlugin({ plugins });
    registerPlugin(this, corePlugin);
  }

  run(key: string, ...args: any[]) {
    const { middleware } = this;
    const fns = middleware[key] || [];
    const i = 0;
    const composedFn = memoizeOne(compose)(fns);
    // @ts-ignore
    return composedFn(...args);
  }

  change(model: Model) {
    this.onChange(model);
  }

  // operation(props) {
  //   this.run('operation', props);
  // }
}
