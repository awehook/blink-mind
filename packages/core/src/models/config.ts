import { DiagramLayoutType } from '../types';
import { Record } from 'immutable';
import { ThemeType, themes } from '../configs/theme';

type ConfigRecordType = {
  readOnly?: boolean;
  layoutDir?: DiagramLayoutType;
  theme?: ThemeType;
};

const defaultConfigRecord: ConfigRecordType = {
  readOnly: false,
  layoutDir: DiagramLayoutType.LEFT_TO_RIGHT,
  theme: themes['default']
};

export class Config extends Record(defaultConfigRecord) {
  get layoutDir(): DiagramLayoutType {
    return this.get('layoutDir');
  }

  get readOnly(): boolean {
    return this.get('readOnly');
  }

  get theme(): ThemeType {
    return this.get('theme');
  }

  static fromJSON(obj) {
    return new Config(obj);
  }
}
