import { KeyType } from '../types';
import { List, Record } from 'immutable';
import { Block } from './block';
import { Relation } from './relation';

type TopicRecordType = {
  key: KeyType;
  parentKey: KeyType;
  subKeys: List<KeyType>;
  blocks: List<Block>;
  relations: List<Relation>;
  style: string;
};

const defaultTopicRecord: TopicRecordType = {
  key: null,
  parentKey: null,
  subKeys: null,
  blocks: null,
  relations: null,
  style: null
};

export class Topic extends Record(defaultTopicRecord) {}
