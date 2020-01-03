import { KeyType } from '@blink-mind/core';
import { List, Map, Record } from 'immutable';

type ReferenceRecordType = {
  keyList: List<KeyType>;
  dataMap: Map<KeyType, any>;
};

const defaultReferenceRecord: ReferenceRecordType = {
  keyList: List(),
  dataMap: Map()
};

export class ReferenceRecord extends Record(defaultReferenceRecord) {
  get keyList(): List<KeyType> {
    return this.get('keyList');
  }

  get dataMap(): Map<KeyType, any> {
    return this.get('dataMap');
  }
}

type ExtDataReferenceRecordType = {
  reference: Map<KeyType, ReferenceRecord>;
};

const defaultExtDataReferenceRecord: ExtDataReferenceRecordType = {
  reference: Map()
};

export class ExtDataReference extends Record(defaultExtDataReferenceRecord) {
  get reference(): Map<KeyType, ReferenceRecord> {
    return this.get('reference');
  }

  getReferenceKeys(topicKey: KeyType): KeyType[] {
    if (this.reference.has(topicKey)) {
      return this.reference.get(topicKey).keyList.toArray();
    }
    return [];
  }

  getReferencedKeys(topicKey: KeyType): KeyType[] {
    const res = [];
    this.reference.forEach((v, k) => {
      if (v.keyList.includes(topicKey)) {
        res.push(k);
      }
    });
    return res;
  }
}
