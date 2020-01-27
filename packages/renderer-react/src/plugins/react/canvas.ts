import { getI18nText, I18nKey } from '../../utils';

export function CanvasPlugin() {
  return {
    getCanvasTitle(ctx) {
      const { model } = ctx;
      return model.title || getI18nText(ctx, I18nKey.CANVAS);
    }
  };
}
