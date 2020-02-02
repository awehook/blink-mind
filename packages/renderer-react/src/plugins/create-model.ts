import { CanvasModel, DocModel } from '@blink-mind/core';

export function CreateModelPlugin() {
  return {
    createNewDocModel(ctx) {
      return DocModel.createEmpty();
    },

    // TODO
    createNewCanvasModel(props) {
      return CanvasModel.createEmpty();
    }
  };
}
