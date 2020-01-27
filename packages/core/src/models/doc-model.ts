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
  formatVersion: '0.1'
};

export class DocModel extends Record(defaultDocRecord) {
  get canvasModels(): List<CanvasModel> {
    return this.get('canvasModels');
  }

  get currentCanvasIndex(): number {
    return this.get('currentCanvasIndex');
  }

  get formatVersion(): string {
    return this.get('formatVersion');
  }

  static createEmpty() {
    return new DocModel({
      canvasModels: List([CanvasModel.createEmpty()]),
      currentCanvasIndex: 0
    });
  }

  get currentCanvasModel(): CanvasModel {
    return this.canvasModels.get(this.currentCanvasIndex);
  }
}
