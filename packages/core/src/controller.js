class Controller {
  constructor(options = {}) {
    const { controller = this, construct = true } = options;
    this.controller = controller;
    this.middleware = {};
    if (construct) {
      this.run('onConstruct');
    }
  }

  run(key, ...args) {
    const { controller, middleware } = this;
    const fns = middleware[key] || [];
    let i = 0;

    function next(...overrides) {
      const fn = fns[i++];
      if (!fn) return;

      if (overrides.length) {
        args = overrides;
      }

      const ret = fn(...args, controller, next);
      return ret;
    }
    return next();
  }
}
