import { Record, Map } from 'immutable';
import { Topic } from './topic';
import { KeyType } from '../types';

type DocRecordType = {
  topics: Map<KeyType, Topic>;
  rootTopicKey: KeyType;
};

const defaultDocRecord: DocRecordType = {
  topics: null,
  rootTopicKey: null
};

export class Doc extends Record(defaultDocRecord) {}
