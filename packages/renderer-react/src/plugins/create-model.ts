import { CanvasModel, DocModel } from '@blink-mind/core';
import { List } from 'immutable';

export function CreateModelPlugin() {
  return {
    createNewDocModel(ctx) {
      const { controller } = ctx;
      return new DocModel({
        canvasModels: List([controller.run('createNewCanvasModel', ctx)]),
        currentCanvasIndex: 0
      });
    },

    // TODO
    createNewCanvasModel(props) {
      return CanvasModel.createEmpty();
    }
  };
}
