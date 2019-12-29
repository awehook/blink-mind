import { KeyType } from '@blink-mind/core';
import { List, Record } from 'immutable';

type ReferenceTopicRecordType = {
  reference: List<KeyType>;
  referenced: List<KeyType>;
};

const defaultReferenceTopicRecord: ReferenceTopicRecordType = {
  reference: List(),
  referenced: List()
};

export class ReferenceTopicRecord extends Record(defaultReferenceTopicRecord) {
  get reference() {
    return this.get('reference');
  }
  get referenced() {
    return this.get('referenced');
  }
}
