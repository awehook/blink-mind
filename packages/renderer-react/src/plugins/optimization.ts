export function OptmizationPlugin() {
  return {
    componentAreEqual(ctx) {
      const { prevProps, nextProps } = ctx;
      const { model: nmodel, topic: ntopic } = nextProps;
      const { model, topic, topicKey } = prevProps;
      if (nmodel.focusKey === topicKey || model.focusKey === topicKey)
        return false;

      if (ntopic === topic) return true;
      return false;
    }
  };
}
