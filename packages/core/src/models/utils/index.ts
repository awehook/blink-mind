import { Model } from '../model';
import { KeyType } from '../../types';

export function getAllSubItemKeys(model: Model, topicKey: KeyType): KeyType[] {
  const item = model.getTopic(topicKey);

  let res = [];
  if (item.subKeys.size > 0) {
    const subKeys = item.subKeys.toArray();
    res.push(...subKeys);
    res = subKeys.reduce((acc, key) => {
      acc.push(...getAllSubItemKeys(model, key));
      return acc;
    }, res);
  }
  return res;
}
