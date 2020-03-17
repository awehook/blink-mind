import { BaseProps } from '../components/common';

export function OptmizationPlugin() {
  return {
    componentAreEqual(ctx: { prevProps: BaseProps; nextProps: BaseProps }) {
      const { prevProps, nextProps } = ctx;
      const { model: nmodel, docModel: ndocModel, topic: ntopic } = nextProps;
      if (ndocModel.currentSheetModel !== nmodel) return true;
      const { model, topic, topicKey } = prevProps;

      if (nmodel.config.theme !== model.config.theme) return false;

      if (nmodel.focusKey === topicKey || model.focusKey === topicKey)
        return false;

      if (ntopic === topic) return true;
      return false;
    },

    sheetAreEqual(ctx) {
      const { nextProps } = ctx;
      const { model: nmodel, docModel: ndocModel } = nextProps;
      if (ndocModel.currentSheetModel !== nmodel) return true;
      return false;
    }
  };
}
