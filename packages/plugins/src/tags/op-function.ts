import { BaseDocModelModifierArg } from '@blink-mind/core';
import { List } from 'immutable';
import { ExtDataTags, TagRecord } from './ext-data-tags';
import { EXT_DATA_KEY_TAGS } from './utils';

export function addNewTag({
  docModel,
  tag
}: BaseDocModelModifierArg & { tag: TagRecord }) {
  let extData: ExtDataTags = docModel.getExtDataItem(
    EXT_DATA_KEY_TAGS,
    ExtDataTags
  );

  if (extData.tags.has(tag.name)) {
    return docModel;
  }
  extData = extData.update('tags', tags => tags.set(tag.name, tag));
  docModel = docModel.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return docModel;
}

export function deleteTag({
  docModel,
  tagName
}: BaseDocModelModifierArg & { tagName: string }) {
  let extData: ExtDataTags = docModel.getExtDataItem(
    EXT_DATA_KEY_TAGS,
    ExtDataTags
  );

  if (!extData.tags.has(tagName)) {
    return docModel;
  }
  extData = extData.update('tags', tags => tags.delete(tagName));
  docModel = docModel.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return docModel;
}

export function updateTag({
  docModel,
  oldTagName,
  newTag
}: BaseDocModelModifierArg & { oldTagName: string; newTag: TagRecord }) {
  let extData: ExtDataTags = docModel.getExtDataItem(
    EXT_DATA_KEY_TAGS,
    ExtDataTags
  );
  extData = extData.update('tags', tags =>
    tags.delete(oldTagName).set(newTag.name, newTag)
  );
  docModel = docModel.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return docModel;
}

export function addTopicTag({
  docModel,
  topicKey,
  tagName
}: BaseDocModelModifierArg & {
  tagName: string;
}) {
  let extData = docModel.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  extData = extData.updateIn(
    ['tags', tagName, 'topicKeys'],
    (topicKeys: List<KeyType>) =>
      // @ts-ignore
      topicKeys.push(topicKey)
  );
  docModel = docModel.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return docModel;
}

export function removeTopicTag({
  docModel,
  topicKey,
  tagName
}: BaseDocModelModifierArg & {
  tagName: string;
}) {
  let extData = docModel.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  extData = extData.updateIn(
    ['tags', tagName, 'topicKeys'],
    (topicKeys: List<KeyType>) =>
      // @ts-ignore
      topicKeys.delete(topicKeys.indexOf(topicKey))
  );
  docModel = docModel.setIn(['extData', EXT_DATA_KEY_TAGS], extData);
  return docModel;
}

export function getTopicTagNames({ docModel, topicKey }): string[] {
  const extData = docModel.getExtDataItem(EXT_DATA_KEY_TAGS, ExtDataTags);
  const res = [];
  extData.tags.forEach(v => {
    if (v.topicKeys.includes(topicKey)) {
      res.push(v.name);
    }
  });
  return res;
}
