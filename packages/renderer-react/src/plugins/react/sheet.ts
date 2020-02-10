import { getI18nText, I18nKey } from '../../utils';

export function SheetPlugin() {
  return {
    getSheetTitle(ctx) {
      const { model } = ctx;
      return model.title || getI18nText(ctx, I18nKey.SHEET);
    }
  };
}
