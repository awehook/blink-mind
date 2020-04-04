import { Record } from 'immutable';
import { defaultTheme, ThemeType } from '../configs/theme';
import { DiagramLayoutType, ViewModeMindMap } from '../types';

export type ConfigRecordType = {
  viewMode: string;
  readOnly?: boolean;
  allowUndo?: boolean;
  layoutDir?: DiagramLayoutType;
  theme?: ThemeType;
};

const defaultConfigRecord: ConfigRecordType = {
  viewMode: ViewModeMindMap,
  readOnly: false,
  allowUndo: true,
  layoutDir: DiagramLayoutType.LEFT_TO_RIGHT,
  theme: defaultTheme
};

export class Config extends Record(defaultConfigRecord) {
  get viewMode(): string {
    return this.get('viewMode');
  }

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
