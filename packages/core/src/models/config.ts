import { DiagramLayoutDirection } from '../types';
import { Record } from 'immutable';

type ConfigRecordType = {
  readOnly?: boolean;
  layoutDir?: DiagramLayoutDirection;
};

const defaultConfigRecord: ConfigRecordType = {
  readOnly: false,
  layoutDir: DiagramLayoutDirection.LEFT_TO_RIGHT
};

export class Config extends Record(defaultConfigRecord) {
  get layoutDir(): DiagramLayoutDirection {
    return this.get('layoutDir');
  }

  get readOnly(): boolean {
    return this.get('readOnly');
  }

  static fromJSON(obj){
    return new Config(obj);
  }
}
