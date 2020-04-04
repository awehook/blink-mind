export function SimpleCaptureErrorPlugin() {
  return {
    captureError(ctx) {
      const { error } = ctx;
      /* tslint:disable */
      console.error(error);
    }
  };
}
