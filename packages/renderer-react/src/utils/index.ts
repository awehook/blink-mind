import { KeyType, Model } from '@blink-mind/core';

export function getLinkKey(fromKey: KeyType, toKey: KeyType) {
  return `link-${fromKey}-${toKey}`;
}
