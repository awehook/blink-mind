import { List, Record } from 'immutable';
import { SheetModel } from './sheet-model';

type DocRecordType = {
  sheetModels: List<SheetModel>;
  currentSheetIndex: number;
  formatVersion: string;
};

const defaultDocRecord: DocRecordType = {
  sheetModels: List(),
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
}
