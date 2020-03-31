import { List, Map, Record } from 'immutable';
type TagRecordType = {
  name: string;
  style: string;
  topicKeys: List<KeyType>;
};

const defaultTagRecord: TagRecordType = {
  name: null,
  style: null,
  topicKeys: List()
};

export class TagRecord extends Record(defaultTagRecord) {
  get name(): string {
    return this.get('name');
  }

  get style(): string {
    return this.get('style');
  }

  get topicKeys(): List<KeyType> {
    return this.get('topicKeys');
  }
}

type ExtDataTagsRecordType = {
  tags: Map<string, TagRecord>;
};

const defaultExtDataTagsRecord: ExtDataTagsRecordType = {
  tags: Map()
};

export class ExtDataTags extends Record(defaultExtDataTagsRecord) {
  get tags(): Map<string, TagRecord> {
    return this.get('tags');
  }

  getTopicTags(topicKey): Array<TagRecord> {
    const res = [];
    this.tags.forEach(v => {
      v.topicKeys.includes(topicKey) && res.push(v);
    });
    return res;
  }
}
