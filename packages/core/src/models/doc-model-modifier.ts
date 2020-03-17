import debug from 'debug';

import { KeyType } from '../types';
import { DocModel } from './doc-model';
import { SheetModel } from './sheet-model';
import { SheetModelModifier } from './sheet-model-modifier';

const log = debug('modifier');

export type BaseDocModelModifierArg = {
  docModel: DocModel;
  //sheetModel是为了增删sheet使用的
  sheetModel: SheetModel;
  model?: SheetModel;
  topicKey?: KeyType;
};

type DocModelModifierResult = DocModel;

export function setCurrentSheetModel(
  docModel: DocModel,
  sheetModel: SheetModel
): DocModel {
  if (docModel.currentSheetModel !== sheetModel) {
    docModel = docModel.updateIn(
      ['sheetModels', docModel.currentSheetIndex],
      m => sheetModel
    );
  }
  return docModel;
}

export function toDocModelModifierFunc(sheetModelModifierFunc) {
  return arg => {
    const { docModel, ...rest } = arg;
    return setCurrentSheetModel(
      docModel,
      sheetModelModifierFunc({ ...rest, model: docModel.currentSheetModel })
    );
  };
}

function addSheet({
  docModel,
  sheetModel
}: BaseDocModelModifierArg): DocModelModifierResult {
  docModel = docModel.update('sheetModels', sheetModels =>
    sheetModels.push(sheetModel)
  );
  docModel = docModel.set('currentSheetIndex', docModel.sheetModels.size - 1);
  return docModel;
}

function setCurrentSheet({
  docModel,
  sheetIndex = null,
  sheetModel = null
}: BaseDocModelModifierArg & { sheetIndex?: number }) {
  if (sheetIndex != null && sheetModel != null) {
    throw new Error('index and sheetModel both not null');
  }
  if (sheetIndex != null && docModel.currentSheetIndex !== sheetIndex) {
    if (sheetIndex >= 0 && sheetIndex < docModel.sheetModels.size) {
      docModel = docModel.set('currentSheetIndex', sheetIndex);
    }
  }
  if (sheetModel != null) {
    const idx = docModel.sheetModels.indexOf(sheetModel);
    if (idx === -1) {
      throw new Error('sheetModel is not in docModel');
    }
    docModel = docModel.set('currentSheetIndex', idx);
  }
  return docModel;
}

function duplicateSheet({
  docModel,
  sheetModel,
  title
}: BaseDocModelModifierArg & { title: string }) {
  const idx = docModel.sheetModels.indexOf(sheetModel);
  if (idx === -1) {
    throw new Error('sheetModel is not in docModel');
  }
  docModel = docModel
    .update('sheetModels', sheetModels =>
      sheetModels.insert(idx + 1, sheetModel.set('title', title))
    )
    .set('currentSheetIndex', idx + 1);
  return docModel;
}

function deleteSheet({ docModel, sheetModel }: BaseDocModelModifierArg) {
  const idx = docModel.sheetModels.indexOf(sheetModel);
  if (idx === -1) {
    throw new Error('sheetModel is not in docModel');
  }
  docModel = docModel
    .update('sheetModels', sheetModels => sheetModels.delete(idx))
    .set('currentSheetIndex', 0);
  return docModel;
}

function setSheetTitle({ docModel, title }) {
  docModel = docModel.updateIn(
    ['sheetModels', docModel.currentSheetIndex],
    sheetModel => sheetModel.set('title', title)
  );
  return docModel;
}

const DocModelModifier: any = {
  addSheet,
  setCurrentSheet,
  duplicateSheet,
  deleteSheet,
  setSheetTitle
};

Object.keys(SheetModelModifier).forEach(k => {
  DocModelModifier[k] = toDocModelModifierFunc(SheetModelModifier[k]);
});

export { DocModelModifier };
