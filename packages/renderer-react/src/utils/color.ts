import { Colors } from '@blueprintjs/core';
import * as colorString from 'color-string';

export const COLORS = {
  // ITEM_HIGHLIGHT: 'rgb(44, 184, 146)'
  ITEM_HIGHLIGHT: Colors.BLUE5,

  LIGHT_HIGHLIGHT_BG: Colors.LIGHT_GRAY3,

  DARK_BACKGROUND: Colors.DARK_GRAY3,

  DARK_CARD_BG: Colors.DARK_GRAY3,

  DARK_HIGHLIGHT_BG: Colors.DARK_GRAY5
};

export function setColorAlpha(color: string, alpha: number) {
  const [r, g, b, a] = colorString.get.rgb(color);
  return colorString.to.rgb([r, g, b, alpha]);
}

export function setColorAlphaPercent(color: string, percent: number) {
  const [r, g, b, a] = colorString.get.rgb(color);
  return colorString.to.rgb([r, g, b, a * percent]);
}
