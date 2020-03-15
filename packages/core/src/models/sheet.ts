import { Record } from 'immutable';

type SheetRecordType = {
  type: string;
  data: any;
};

const defaultSheetReocrd: SheetRecordType = {
  type: null,
  data: null
};

export class Sheet extends Record(defaultSheetReocrd) {
  get type() {
    return this.get('type');
  }

  get data() {
    return this.get('data');
  }
}
