import { KeyType } from '../types';
import { Record } from 'immutable';

type BlockRecordType = {
  type: string;
  key: KeyType;
  data: any;
};

const defaultBlockRecord: BlockRecordType = {
  type: null,
  key: null,
  data: null
};

export class Block extends Record(defaultBlockRecord) {}
