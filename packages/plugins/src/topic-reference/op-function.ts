import { BaseDocModelModifierArg, KeyType } from '@blink-mind/core';
import { List } from 'immutable';
import { ExtDataReference, ReferenceRecord } from './ext-data-reference';
import { EXT_DATA_KEY_TOPIC_REFERENCE } from './utils';

// TODO 能否优化这个函数的写法
export function setReferenceTopicKeys({
  docModel,
  topicKey,
  referenceKeys
}: BaseDocModelModifierArg & { referenceKeys: KeyType[] }) {
  let extData: ExtDataReference = docModel.getExtDataItem(
    EXT_DATA_KEY_TOPIC_REFERENCE,
    ExtDataReference
  );

  let referenceRecord =
    extData.reference.get(topicKey) || new ReferenceRecord();

  referenceRecord = referenceRecord.set('keyList', List(referenceKeys));
  extData = extData.setIn(['reference', topicKey], referenceRecord);
  docModel = docModel.setIn(['extData', EXT_DATA_KEY_TOPIC_REFERENCE], extData);

  return docModel;
}
