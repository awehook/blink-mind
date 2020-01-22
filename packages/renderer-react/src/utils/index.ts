import { KeyType } from '@blink-mind/core';

export function getLinkKey(fromKey: KeyType, toKey: KeyType) {
  return `link-${fromKey}-${toKey}`;
}

export type Point = {
  x: number;
  y: number;
};

export function centerY(rect: ClientRect) {
  return (rect.top + rect.bottom) / 2;
}

export function centerX(rect: ClientRect) {
  return (rect.left + rect.right) / 2;
}

export function centerPointX(p1, p2) {
  return (p1.x + p2.x) / 2;
}

export function centerPointY(p1, p2) {
  return (p1.y + p2.y) / 2;
}

export function center(rect) {
  return [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
}
export function getRelativeRect(
  el: HTMLElement,
  rel: HTMLElement,
  scale: number = 1
) {
  const rect = el.getBoundingClientRect();
  const relRect = rel.getBoundingClientRect();

  const relCenter = center(relRect);
  const elCenter = center(rect);
  elCenter[0] = (elCenter[0] - relCenter[0]) / scale;
  elCenter[1] = (elCenter[1] - relCenter[1]) / scale;
  const width = rect.width / scale;
  const height = rect.height / scale;
  return {
    left: elCenter[0] - width / 2,
    right: elCenter[0] + width / 2,
    top: elCenter[1] - height / 2,
    bottom: elCenter[1] + height / 2,
    width,
    height
  };
}

export function getRelativeVector(el: HTMLElement, rel: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const relRect = rel.getBoundingClientRect();
  const relCenter = center(relRect);
  const elCenter = center(rect);
  return [elCenter[0] - relCenter[0], elCenter[1] - relCenter[1]];
}

export * from './icon';
export * from './keys';
export * from './events';
export * from './file';
export * from './css';
export * from './i18n';
