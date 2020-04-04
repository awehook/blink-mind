import { SheetModel } from '@blink-mind/core';

export function tvZoomFactorKey(model: SheetModel) {
  return `ZoomFactor-${model.id}-${model.config.viewMode}`;
}
