import { List, Record } from 'immutable';
import { KeyType } from '../types';

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
  get data(): any {
    return this.get('data');
  }

  get type(): string {
    return this.get('type');
  }

  static create(obj: BlockRecordType): Block {
    return new Block(obj);
  }

  static createList(obj: any): List<Block> {
    if (List.isList(obj) || Array.isArray(obj)) {
      // @ts-ignore
      return List(obj.map(Block.create));
    }
    throw new Error(
      `Block.createList only accepts Array or List, but you passed it: ${obj}`
    );
  }
}
