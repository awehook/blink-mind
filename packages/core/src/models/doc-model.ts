import { List, Record, Map } from 'immutable';
import { SheetModel } from './sheet-model';

export type ExtData = Map<string, any>;

type DocRecordType = {
  sheetModels: List<SheetModel>;
  // 用于插件做扩展
  extData: ExtData;
  currentSheetIndex: number;
  formatVersion: string;
};

const defaultDocRecord: DocRecordType = {
  sheetModels: List(),
  extData: Map(),
  currentSheetIndex: -1,
  formatVersion: '0.1'
};

export class DocModel extends Record(defaultDocRecord) {
  get sheetModels(): List<SheetModel> {
    return this.get('sheetModels');
  }

  get currentSheetIndex(): number {
    return this.get('currentSheetIndex');
  }

  get formatVersion(): string {
    return this.get('formatVersion');
  }

  static createEmpty() {
    return new DocModel({
      sheetModels: List([SheetModel.createEmpty()]),
      currentSheetIndex: 0
    });
  }

  get currentSheetModel(): SheetModel {
    return this.sheetModels.get(this.currentSheetIndex);
  }

  get extData(): ExtData {
    return this.get('extData');
  }

  getSheetIndex(sheetModel:SheetModel) {
    return this.sheetModels.indexOf(sheetModel);
  }

  getExtDataItem<T>(key: string, c: new () => T): T {
    return this.extData.get(key) || new c();
  }
}
