import { DiagramLayoutType } from '../types';
import { Record } from 'immutable';
import { ThemeType, defaultTheme } from '../configs/theme';

type ConfigRecordType = {
  readOnly?: boolean;
  allowUndo?: boolean;
  layoutDir?: DiagramLayoutType;
  theme?: ThemeType;
};

const defaultConfigRecord: ConfigRecordType = {
  readOnly: false,
  allowUndo: true,
  layoutDir: DiagramLayoutType.LEFT_AND_RIGHT,
  theme: defaultTheme
};

export class Config extends Record(defaultConfigRecord) {
  get layoutDir(): DiagramLayoutType {
    return this.get('layoutDir');
  }

  get readOnly(): boolean {
    return this.get('readOnly');
  }

  get allowUndo(): boolean {
    return this.get('allowUndo');
  }

  get theme(): ThemeType {
    return this.get('theme');
  }

  static fromJSON(obj) {
    return new Config(obj);
  }
}
