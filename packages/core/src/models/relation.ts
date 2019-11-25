import { Record } from 'immutable';
import { KeyType } from '../types';

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
