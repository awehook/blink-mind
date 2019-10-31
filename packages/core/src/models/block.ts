import { KeyType } from '../types';
import { Record } from 'immutable';

type BlockRecordType = {
  type: string;
  key?: KeyType;
  data: any;
};

const defaultBlockRecord: BlockRecordType = {
  type: null,
  key: null,
  data: null
};

export class Block extends Record(defaultBlockRecord) {
  get data() {
    return this.get('data');
  }

  get type() {
    return this.get('type');
  }

  static create(obj: BlockRecordType): Block {
    return new Block(obj);
  }
}
