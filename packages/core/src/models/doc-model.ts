import { List, Map, Record } from 'immutable';
import { KeyType } from '../types';
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

  getSheetModel(sheetId: string): SheetModel {
    return this.sheetModels.find(s => s.id === sheetId);
  }

  getSheetIndex(sheetModel: SheetModel | KeyType) {
    return sheetModel instanceof SheetModel
      ? this.sheetModels.indexOf(sheetModel)
      : this.sheetModels.findIndex(s => s.id === sheetModel);
  }

  getExtDataItem<T>(key: string, c: new () => T): T {
    return this.extData.get(key) || new c();
  }

  getSheetIdThatContainsTopic(topicKey: KeyType) {
    const sheet: SheetModel = this.sheetModels.find(s =>
      s.topics.has(topicKey)
    );
    return sheet ? sheet.id : null;
  }
}
