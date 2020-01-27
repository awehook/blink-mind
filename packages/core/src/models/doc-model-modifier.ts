import debug from 'debug';

import { KeyType } from '../types';
import { CanvasModel } from './canvas-model';
import { CanvasModelModifier } from './canvas-model-modifier';
import { DocModel } from './doc-model';

const log = debug('modifier');

export type BaseDocModelModifierArg = {
  docModel: DocModel;
  model?: CanvasModel;
  topicKey?: KeyType;
};

type DocModelModifierResult = DocModel;

export function setCurrentCanvasModel(
  docModel: DocModel,
  canvasModel: CanvasModel
): DocModel {
  if (docModel.currentCanvasModel !== canvasModel) {
    docModel = docModel.updateIn(
      ['canvasModels', docModel.currentCanvasIndex],
      m => canvasModel
    );
  }
  return docModel;
}

export function toDocModelModifierFunc(canvasModelModifierFunc) {
  return arg => {
    const { docModel, ...rest } = arg;
    return setCurrentCanvasModel(
      docModel,
      canvasModelModifierFunc({ ...rest, model: docModel.currentCanvasModel })
    );
  };
}

function addCanvas({
  docModel,
  model
}: BaseDocModelModifierArg): DocModelModifierResult {
  docModel = docModel.update('canvasModels', canvasModels =>
    canvasModels.push(model)
  );
  docModel = docModel.set('currentCanvasIndex', docModel.canvasModels.size - 1);
  return docModel;
}

function setCurrentCanvas({
  docModel,
  canvasIndex = null,
  model = null
}: BaseDocModelModifierArg & { canvasIndex?: number }) {
  if (canvasIndex != null && model != null) {
    throw new Error('index and canvasModel both not null');
  }
  if (canvasIndex != null && docModel.currentCanvasIndex !== canvasIndex) {
    if (canvasIndex >= 0 && canvasIndex < docModel.canvasModels.size) {
      docModel = docModel.set('currentCanvasIndex', canvasIndex);
    }
  }
  if (model != null) {
    const idx = docModel.canvasModels.indexOf(model);
    if (idx === -1) {
      throw new Error('canvasModel is not in docModel');
    }
    docModel = docModel.set('currentCanvasIndex', idx);
  }
  return docModel;
}

function duplicateCanvas({
  docModel,
  model,
  title
}: BaseDocModelModifierArg & { title: string }) {
  const idx = docModel.canvasModels.indexOf(model);
  if (idx === -1) {
    throw new Error('canvasModel is not in docModel');
  }
  docModel = docModel
    .update('canvasModels', canvasModels =>
      canvasModels.insert(idx + 1, model.set('title', title))
    )
    .set('currentCanvasIndex', idx + 1);
  return docModel;
}

function deleteCanvas({ docModel, model }: BaseDocModelModifierArg) {
  const idx = docModel.canvasModels.indexOf(model);
  if (idx === -1) {
    throw new Error('canvasModel is not in docModel');
  }
  docModel = docModel
    .update('canvasModels', canvasModels => canvasModels.delete(idx))
    .set('currentCanvasIndex', 0);
  return docModel;
}

function setCanvasTitle({ docModel, title }) {
  docModel = docModel.updateIn(
    ['canvasModels', docModel.currentCanvasIndex],
    canvasModel => canvasModel.set('title', title)
  );
  return docModel;
}

const DocModelModifier: any = {
  addCanvas,
  setCurrentCanvas,
  duplicateCanvas,
  deleteCanvas,
  setCanvasTitle
};

Object.keys(CanvasModelModifier).forEach(k => {
  DocModelModifier[k] = toDocModelModifierFunc(CanvasModelModifier[k]);
});

export { DocModelModifier };
