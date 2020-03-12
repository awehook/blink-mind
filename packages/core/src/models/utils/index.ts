import { KeyPath, KeyType, TopicRelationship } from '../../types';
import { SheetModel } from '../sheet-model';

export function getAllSubTopicKeys(
  model: SheetModel,
  topicKey: KeyType
): KeyType[] {
  const item = model.getTopic(topicKey);

  let res = [];
  if (item.subKeys.size > 0) {
    const subKeys = item.subKeys.toArray();
    res.push(...subKeys);
    res = subKeys.reduce((acc, key) => {
      acc.push(...getAllSubTopicKeys(model, key));
      return acc;
    }, res);
  }
  return res;
}

export function getKeyPath(
  model: SheetModel,
  topicKey: KeyType,
  reverse: boolean = false
): KeyPath {
  const res = [topicKey];
  let item = model.getTopic(topicKey);
  while (item.parentKey) {
    reverse ? res.push(item.parentKey) : res.unshift(item.parentKey);
    item = model.getParentTopic(item.key);
  }
  return res;
}

export function getRelationship(
  model: SheetModel,
  srcKey: KeyType,
  dstKey: KeyType
): string {
  const srcTopic = model.getTopic(srcKey);
  const dstTopic = model.getTopic(dstKey);
  if (srcTopic && dstTopic) {
    if (srcTopic.parentKey == dstTopic.parentKey)
      return TopicRelationship.SIBLING;
    let pTopic = srcTopic;
    while (pTopic.parentKey) {
      if (pTopic.parentKey === dstTopic.key)
        return TopicRelationship.DESCENDANT;
      pTopic = model.getParentTopic(pTopic.key);
    }
    pTopic = dstTopic;
    while (pTopic.parentKey) {
      if (pTopic.parentKey === srcTopic.key) return TopicRelationship.ANCESTOR;
      pTopic = model.getParentTopic(pTopic.key);
    }
  }
  return TopicRelationship.NONE;
}

export function getPrevTopicKey(model: SheetModel, topicKey: KeyType) {
  const parentTopic = model.getParentTopic(topicKey);
  if (parentTopic) {
    const index = parentTopic.subKeys.indexOf(topicKey);
    if (index === 0) {
      return parentTopic.key;
    }
    return parentTopic.subKeys.get(index - 1);
  }
  return null;
}

export function getNextTopicKey(model: SheetModel, topicKey: KeyType) {}

export function isFisrtChild(model: SheetModel, topicKey: KeyType) {
  const parentTopic = model.getParentTopic(topicKey);
  if (parentTopic) {
    const index = parentTopic.subKeys.indexOf(topicKey);
    if (index === 0) {
      return true;
    }
  }
  return false;
}
