export function PlatformPlugin() {
  let _isOSX;
  return {
    isOSX(ctx) {
      if (_isOSX == null) {
        _isOSX = navigator.userAgent.includes('Mac');
      }
      return _isOSX;
    },

    isCommandOrControl(ctx) {
      const { controller, ev } = ctx;
      const isOSX = controller.run('isOSX', ctx);
      return (isOSX && ev.metaKey) || (!isOSX && ev.ctrlKey);
    }
  };
}
