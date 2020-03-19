import { getI18nText, I18nKey } from '../../utils';

export function SheetPlugin() {
  return {
    getSheetTitle(ctx) {
      const { docModel, model } = ctx;
      return (
        model.title ||
        `${getI18nText(ctx, I18nKey.SHEET)}${docModel.getSheetIndex(model) + 1}`
      );
    }
  };
}
