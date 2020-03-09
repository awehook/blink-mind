import { Record } from 'immutable';

type DescBlockDataRecordType = {
  kind: string;
  data: any;
};

const defaultDescBlockDataRecord: DescBlockDataRecordType = {
  kind: null,
  data: null
};

export class DescBlockData extends Record(defaultDescBlockDataRecord) {
  get kind() {
    return this.get('kind');
  }

  get data() {
    return this.get('data');
  }
}
