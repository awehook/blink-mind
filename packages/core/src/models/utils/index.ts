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

// 判断该topic是否为其父亲的第一个孩子
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

export function isSibling(
  model: SheetModel,
  key1: KeyType,
  key2: KeyType
): boolean {
  return model.getParentTopic(key1) === model.getParentTopic(key2);
}

/**
 * 根据当前元素的Key,获取depth=depth的祖先的key
 * @param model
 * @param key
 * @param depth
 */
export function getAncestorKeyByDepth(
  model: SheetModel,
  key: KeyType,
  depth: number
) {
  let curDepth = model.getDepth(key);
  if (curDepth === depth) return key;
  if (curDepth < depth) return null;
  while (curDepth > depth) {
    key = model.getParentKey(key);
    curDepth--;
  }
  return key;
}

/**
 * 找到他们互为sibling的祖先的Key,返回一个数组里面有两个祖先的key
 * @param model
 * @param key1
 * @param key2
 */
export function getSiblingAncestorKeys(
  model: SheetModel,
  key1: KeyType,
  key2: KeyType
): Array<KeyType> {
  const d1 = model.getDepth(key1);
  const d2 = model.getDepth(key2);
  if (d1 === d2) {
    if (isSibling(model, key1, key2)) return [key1, key2];
    return getSiblingAncestorKeys(
      model,
      model.getParentKey(key1),
      model.getParentKey(key2)
    );
  }
  return d1 > d2
    ? getSiblingAncestorKeys(
        model,
        getAncestorKeyByDepth(model, key1, d2),
        key2
      )
    : getSiblingAncestorKeys(
        model,
        key1,
        getAncestorKeyByDepth(model, key2, d1)
      );
}

/**
 * 获取从subKey1到subKey2之间的subKeys,前提是 subKey1和subKey2的父亲相同
 * @param model
 * @param subKey1
 * @param subKey2
 */
export function getRangeSubKeys(
  model: SheetModel,
  subKey1: KeyType,
  subKey2: KeyType
): Array<KeyType> {
  const topic = model.getParentTopic(subKey1);
  const subKeys = topic.subKeys;
  const i1 = subKeys.indexOf(subKey1);
  const i2 = subKeys.indexOf(subKey2);
  if (i1 < 0 || i2 < 0)
    throw new Error(
      `The parent of subKey1 ${subKey1} and subKey2 ${subKey2} is not same`
    );
  return (i1 < i2
    ? subKeys.slice(i1, i2 + 1)
    : subKeys.slice(i2, i1 + 1)
  ).toArray();
}

/**
 * 获取最底层最下面的后代的Key, 如果该项没有子元素，则返回自己的key
 * @param model
 * @param key
 */
export function getBottomDescendantKey(
  model: SheetModel,
  key: KeyType
): KeyType {
  const topic = model.getTopic(key);
  return topic.subKeys.size === 0
    ? key
    : //@ts-ignore
      getBottomDescendantKey(model, topic.subKeys.last());
}

/**
 * 获取最底层最下面的后代的Key, 需要考虑折叠, 如果该项没有子元素，则返回自己的key
 * @param model
 * @param key
 */
export function getVisualBottomDescendantKey(
  model: SheetModel,
  key: KeyType
): KeyType {
  const topic = model.getTopic(key);
  return topic.subKeys.size === 0 || topic.collapse
    ? key
    : //@ts-ignore
      getVisualBottomDescendantKey(model, topic.subKeys.last());
}

/**
 * 是否都是Sibiling
 * @param model
 * @param keys
 */
export function isAllSibiling(model: SheetModel, keys: Array<KeyType>) {
  if (keys && keys.length > 0) {
    const parentKey = model.getParentKey(keys[0]);
    for (const key of keys) {
      if (model.getParentKey(key) !== parentKey) return false;
    }
    return true;
  }
  return false;
}
