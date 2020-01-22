// import { I18nKey } from './keys';

export function getI18nText(ctx, key: string | string[]) {
  if (Array.isArray(key)) {
    return key.map(k => ctx.controller.run('getI18nText', { ...ctx, key: k }));
  }
  return ctx.controller.run('getI18nText', { ...ctx, key:key.toUpperCase() });
}

// export function getCssI18nText(ctx, cssName) {
//   const cssNames = {
//     none: I18nKey.NONE,
//     solid: I18nKey.SOLID,
//     dotted: I18nKey.DOTTED,
//     dashed: I18nKey.DASHED,
//     double: I18nKey.DOUBLE,
//
//     round: I18nKey.ROUND,
//     curve: I18nKey.CURVE,
//
//   };
//
//   return getI18nText(ctx, cssNames[cssName]);
// }
