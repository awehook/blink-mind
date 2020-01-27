import {CanvasModel, DocModel} from '@blink-mind/core';

export function CreateModelPlugin() {
  return {

    createNewDoc(ctx) {
      return DocModel.createEmpty()
    },

    // TODO
    createNewCanvasModel(props) {
      return CanvasModel.createEmpty();
    }
  };
}
