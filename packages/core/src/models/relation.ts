import { KeyType } from '../types';
import { Record } from 'immutable';

type RelationRecordType = {
  key: KeyType;
  type: string;
  data: any;
};

const defaultRelationRecord: RelationRecordType = {
  key: null,
  type: null,
  data: null
};

export class Relation extends Record(defaultRelationRecord) {}
