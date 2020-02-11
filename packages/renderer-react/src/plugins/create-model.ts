import { DocModel, SheetModel } from '@blink-mind/core';
import { List } from 'immutable';

export function CreateModelPlugin() {
  return {
    createNewDocModel(ctx) {
      const { controller } = ctx;
      return new DocModel({
        sheetModels: List([controller.run('createNewSheetModel', ctx)]),
        currentSheetIndex: 0
      });
    },

    // TODO
    createNewSheetModel(props) {
      return SheetModel.createEmpty();
    }
  };
}
