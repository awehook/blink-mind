import { Record } from 'immutable';

type DescBlockDataRecordType = {
  kind: string;
  data: any;
  collapse: boolean;
};

const defaultDescBlockDataRecord: DescBlockDataRecordType = {
  kind: null,
  data: null,
  collapse: false
};

export class DescBlockData extends Record(defaultDescBlockDataRecord) {
  get kind() {
    return this.get('kind');
  }

  get data() {
    return this.get('data');
  }

  get collapse() {
    return this.get('collapse');
  }
}
