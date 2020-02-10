import { BaseSheetModelModifierArg } from '@blink-mind/core';
import { List } from 'immutable';
import { ExtDataTags, TagRecord } from './ext-data-tags';
import { EXT_DATA_KEY_TAGS } from './utils';

export function addNewTag({
  model,
  tag
}: BaseSheetModelModifierArg & { tag: TagRecord }) {
  let extData: ExtDataTags = model.getExtDataItem(
    EXT_DATA_KEY_TAGS,
    ExtDataTags
  );

  if (extData.tags.has(tag.name)) {
    return model;
  }
  extData = extData.update('tags', tags => tags.set(tag.name, tag));
  model = model.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return model;
}

export function deleteTag({
  model,
  tagName
}: BaseSheetModelModifierArg & { tagName: string }) {
  let extData: ExtDataTags = model.getExtDataItem(
    EXT_DATA_KEY_TAGS,
    ExtDataTags
  );

  if (!extData.tags.has(tagName)) {
    return model;
  }
  extData = extData.update('tags', tags => tags.delete(tagName));
  model = model.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return model;
}

export function updateTag({
  model,
  oldTagName,
  newTag
}: BaseSheetModelModifierArg & { oldTagName: string; newTag: TagRecord }) {
  let extData: ExtDataTags = model.getExtDataItem(
    EXT_DATA_KEY_TAGS,
    ExtDataTags
  );
  extData = extData.update('tags', tags =>
    tags.delete(oldTagName).set(newTag.name, newTag)
  );
  model = model.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return model;
}

export function addTopicTag({
  model,
  topicKey,
  tagName
}: BaseSheetModelModifierArg & {
  tagName: string;
}) {
  let extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  extData = extData.updateIn(
    ['tags', tagName, 'topicKeys'],
    (topicKeys: List<KeyType>) =>
      // @ts-ignore
      topicKeys.push(topicKey)
  );
  model = model.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return model;
}

export function removeTopicTag({
  model,
  topicKey,
  tagName
}: BaseSheetModelModifierArg & {
  tagName: string;
}) {
  let extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  extData = extData.updateIn(
    ['tags', tagName, 'topicKeys'],
    (topicKeys: List<KeyType>) =>
      // @ts-ignore
      topicKeys.delete(topicKeys.indexOf(topicKey))
  );
  model = model.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return model;
}

export function getTopicTagNames({ model, topicKey }): string[] {
  const extData = model.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  const res = [];
  extData.tags.forEach(v => {
    if (v.topicKeys.includes(topicKey)) {
      res.push(v.name);
    }
  });
  return res;
}
