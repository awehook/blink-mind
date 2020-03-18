import { Colors } from '@blueprintjs/core';
import * as colorString from 'color-string';

export const COLORS = {
  HIGHLIGHT: '#48aff0',
  DARK: {
    ZINDEX_BG: '#383838',
    TOOLBAR_BG: '#494646',
    ITEM_BG: '#726E6F',
    ITEM_BG_ACTIVE: '#58595A',
    ITEM: '#C6C2C3',
    ITEM_ACTIVE: '#FFFFFF',
    // CONTAINER_BG: '#2f3235'
    CONTAINER_BG: '#444'
  },

  LIGHT: {
    TOOLBAR_BG: '#D6D6D6',
    ITEM: Colors.GRAY3,
    ITEM_BG: Colors.LIGHT_GRAY1,
    ITEM_ACTIVE: Colors.BLACK,
    ITEM_BG_ACTIVE: Colors.LIGHT_GRAY1,
    CONTAINER_BG: Colors.LIGHT_GRAY5
  }
};

export function setColorAlpha(color: string, alpha: number) {
  const [r, g, b, a] = colorString.get.rgb(color);
  return colorString.to.rgb([r, g, b, alpha]);
}

export function setColorAlphaPercent(color: string, percent: number) {
  const [r, g, b, a] = colorString.get.rgb(color);
  return colorString.to.rgb([r, g, b, a * percent]);
}
