import { List, Record } from 'immutable';
import { CanvasModel } from './canvas-model';

type DocRecordType = {
  canvasModels: List<CanvasModel>;
  currentCanvasIndex: number;
  formatVersion: string;
};

const defaultDocRecord: DocRecordType = {
  canvasModels: List(),
  currentCanvasIndex: -1,
  formatVersion: null
};

export class DocModel extends Record(defaultDocRecord) {
  get canvasModels() {
    return this.get('canvasModels');
  }

  get currentCanvasIndex() {
    return this.get('currentCanvasIndex');
  }

  get formatVersion() {
    return this.get('formatVersion');
  }

  static createEmpty() {
    return new DocModel({
      canvasModels: List([CanvasModel.createEmpty()]),
      currentCanvasIndex: 0
    });
  }

  get currentCanvasModel() {
    return this.canvasModels.get(this.currentCanvasIndex);
  }
}
