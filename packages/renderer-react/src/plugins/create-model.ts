import { DocModel, SheetModel } from '@blink-mind/core';
import { List } from 'immutable';
import { getI18nText, I18nKey } from '../utils';

export function CreateModelPlugin() {
  return {
    createNewDocModel(ctx) {
      const { controller } = ctx;
      const docModel = new DocModel({
        sheetModels: List([controller.run('createNewSheetModel', ctx)]),
        currentSheetIndex: 0
      });
      controller.docModel = docModel;
      return docModel;
    },

    // TODO
    createNewSheetModel(ctx) {
      const { docModel } = ctx;
      const idx = docModel ? docModel.sheetModels.size + 1 : 1;
      const title = getI18nText(ctx, I18nKey.SHEET) + idx;
      return SheetModel.createEmpty({ title });
    }
  };
}
