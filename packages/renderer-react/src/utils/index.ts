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

export * from './icon';
export * from './keys';
