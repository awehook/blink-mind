import debug from 'debug';
import { List } from 'immutable';
import { ThemeType } from '../configs/theme';
import {
  BlockType,
  DiagramLayoutType,
  FocusMode,
  KeyType,
  TopicRelationship
} from '../types';
import { createKey } from '../utils';
import { Block } from './block';
import { CanvasModel } from './canvas-model';
import { DocModel } from './doc-model';
import { Topic } from './topic';
import { getAllSubTopicKeys, getKeyPath, getRelationship } from './utils';

const log = debug('modifier');

type ModifierArg =
  | BaseCanvasModelModifierArg
  | SetTopicArg
  | SetBlockDataArg
  | SetFocusModeArg
  | SetTopicStyleArg
  | SetZoomFactorArg
  | SetThemeArg
  | SetLayoutDirArg;

export type BaseCanvasModelModifierArg = {
  model: CanvasModel;
  topicKey?: KeyType;
};

type SetTopicArg = BaseCanvasModelModifierArg & {
  topic: Topic;
};

type SetBlockDataArg = BaseCanvasModelModifierArg & {
  blockType: string;
  data: any;
  focusMode?: string;
};

type DeleteBlockArg = BaseCanvasModelModifierArg & {
  blockType: string;
};

type SetFocusModeArg = BaseCanvasModelModifierArg & {
  focusMode: string;
};

type SetTopicStyleArg = BaseCanvasModelModifierArg & {
  style: string;
};

type SetZoomFactorArg = BaseCanvasModelModifierArg & {
  zoomFactor: number;
};

type SetThemeArg = BaseCanvasModelModifierArg & {
  theme: ThemeType;
};

type SetLayoutDirArg = BaseCanvasModelModifierArg & {
  layoutDir: DiagramLayoutType;
};

type ModifierResult = CanvasModel;

function toggleCollapse({
  model,
  topicKey
}: BaseCanvasModelModifierArg): ModifierResult {
  let topic = model.getTopic(topicKey);
  if (topic && topic.subKeys.size !== 0) {
    topic = topic.merge({
      collapse: !topic.collapse
    });
    model = model.updateIn(
      ['topics', topic.key, 'collapse'],
      collapse => !collapse
    );
  }
  model = focusTopic({ model, topicKey, focusMode: FocusMode.NORMAL });
  return model;
}

function collapseAll({ model }: BaseCanvasModelModifierArg): ModifierResult {
  const topicKeys = getAllSubTopicKeys(model, model.editorRootTopicKey);
  log(model);
  model = model.withMutations(m => {
    topicKeys.forEach(topicKey => {
      m.setIn(['topics', topicKey, 'collapse'], true);
    });
  });
  model = focusTopic({
    model,
    topicKey: model.editorRootTopicKey,
    focusMode: FocusMode.NORMAL
  });
  return model;
}

function expandAll({ model }: BaseCanvasModelModifierArg): ModifierResult {
  const topicKeys = getAllSubTopicKeys(model, model.editorRootTopicKey);
  log(model);
  model = model.withMutations(m => {
    topicKeys.forEach(topicKey => {
      m.setIn(['topics', topicKey, 'collapse'], false);
    });
  });
  log(model);
  return model;
}

function expandTo({
  model,
  topicKey
}: BaseCanvasModelModifierArg): ModifierResult {
  const keys = getKeyPath(model, topicKey).filter(t => t !== topicKey);
  model = model.withMutations(m => {
    keys.forEach(topicKey => {
      m.setIn(['topics', topicKey, 'collapse'], false);
    });
  });
  // 要让这个节点在视口中可见
  if (
    getRelationship(model, topicKey, model.editorRootTopicKey) !==
    TopicRelationship.DESCENDANT
  ) {
    model = model.set('editorRootTopicKey', model.rootTopicKey);
  }
  return model;
}

function focusTopic({
  model,
  topicKey,
  focusMode
}: SetFocusModeArg): ModifierResult {
  log('focus topic');
  if (topicKey !== model.focusKey) model = model.set('focusKey', topicKey);
  if (focusMode !== model.focusMode) model = model.set('focusMode', focusMode);
  return model;
}

function setFocusMode({ model, focusMode }: SetFocusModeArg): ModifierResult {
  log('setFocusMode');
  if (focusMode !== model.focusMode) model = model.set('focusMode', focusMode);
  return model;
}

function addChild({
  model,
  topicKey
}: BaseCanvasModelModifierArg): ModifierResult {
  log('addChild:', topicKey);
  let topic = model.getTopic(topicKey);
  if (topic) {
    const child = Topic.create({ key: createKey(), parentKey: topic.key });
    topic = topic
      .set('collapse', false)
      .update('subKeys', subKeys => subKeys.push(child.key));
    model = model.update('topics', topics =>
      topics.set(topicKey, topic).set(child.key, child)
    );
    return focusTopic({
      model,
      topicKey: child.key,
      focusMode: FocusMode.EDITING_CONTENT
    });
  }
  return model;
}

function addSibling({
  model,
  topicKey
}: BaseCanvasModelModifierArg): ModifierResult {
  if (topicKey === model.rootTopicKey) return model;
  const topic = model.getTopic(topicKey);
  if (topic) {
    const pItem = model.getTopic(topic.parentKey);
    const idx = pItem.subKeys.indexOf(topicKey);
    const sibling = Topic.create({ key: createKey(), parentKey: pItem.key });
    model = model
      .update('topics', topics => topics.set(sibling.key, sibling))
      .updateIn(['topics', pItem.key, 'subKeys'], subKeys =>
        subKeys.insert(idx + 1, sibling.key)
      );
    return focusTopic({
      model,
      topicKey: sibling.key,
      focusMode: FocusMode.EDITING_CONTENT
    });
  }
  return model;
}

function deleteTopic({
  model,
  topicKey
}: BaseCanvasModelModifierArg): ModifierResult {
  if (topicKey === model.editorRootTopicKey) return model;
  const item = model.getTopic(topicKey);
  if (item) {
    model = model.withMutations(m => {
      m.update('topics', topics => {
        topics = topics.delete(topicKey);
        const deleteKeys = getAllSubTopicKeys(model, topicKey);
        topics = topics.withMutations(t => {
          deleteKeys.forEach(dKey => {
            t.delete(dKey);
          });
        });
        return topics;
      });
      m.updateIn(['topics', item.parentKey, 'subKeys'], subKeys =>
        subKeys.delete(subKeys.indexOf(topicKey))
      );
      if (m.focusKey === topicKey)
        m.set('focusKey', null).set('focusMode', null);
    });
  }

  return model;
}

/**
 * setBlockData of one topic
 * @param model
 * @param topicKey
 * @param blockType
 * @param focusMode
 * @param data
 */
function setBlockData({
  model,
  topicKey,
  blockType,
  focusMode,
  data
}: SetBlockDataArg): ModifierResult {
  const topic = model.getTopic(topicKey);
  if (topic) {
    const { index, block } = topic.getBlock(blockType);
    if (index === -1) {
      model = model.updateIn(['topics', topicKey, 'blocks'], blocks =>
        blocks.push(
          Block.create({
            type: blockType,
            data: data
          })
        )
      );
    } else {
      if (block.data !== data) {
        model = model.updateIn(
          ['topics', topicKey, 'blocks', index, 'data'],
          dt => data
        );
      }
    }
    if (focusMode) {
      model = focusTopic({
        model,
        topicKey,
        focusMode
      });
    }
  }
  return model;
}

function deleteBlock({ model, topicKey, blockType }: DeleteBlockArg) {
  const topic = model.getTopic(topicKey);
  if (topic) {
    const { index } = topic.getBlock(blockType);
    if (index !== -1) {
      model = model.updateIn(['topics', topicKey, 'blocks'], blocks =>
        blocks.delete(index)
      );
    }
    model = focusTopic({
      model,
      topicKey: null,
      focusMode: null
    });
  }
  return model;
}

function setStyle({
  model,
  topicKey,
  style
}: SetTopicStyleArg): ModifierResult {
  const topic = model.getTopic(topicKey);
  if (topic) {
    if (style !== topic.style) {
      model = model.updateIn(['topics', topicKey, 'style'], s => style);
    }
  }
  return model;
}

function clearAllCustomStyle({
  model
}: BaseCanvasModelModifierArg): ModifierResult {
  model = model.withMutations(model => {
    model.topics.keySeq().forEach(key => {
      model.setIn(['topics', key, 'style'], null);
    });
  });
  return model;
}

function setTheme({ model, theme }: SetThemeArg): ModifierResult {
  model = model.setIn(['config', 'theme'], theme);
  return model;
}

function setLayoutDir({ model, layoutDir }: SetLayoutDirArg): ModifierResult {
  if (model.config.layoutDir === layoutDir) return model;
  model = model.setIn(['config', 'layoutDir'], layoutDir);
  return model;
}

function setEditorRootTopicKey({
  model,
  topicKey
}: BaseCanvasModelModifierArg): ModifierResult {
  if (model.editorRootTopicKey !== topicKey)
    model = model.set('editorRootTopicKey', topicKey);
  if (model.getTopic(topicKey).collapse)
    model = model.setIn(['topics', topicKey, 'collapse'], false);
  return model;
}

function setZoomFactor({
  model,
  zoomFactor
}: SetZoomFactorArg): ModifierResult {
  if (model.zoomFactor !== zoomFactor)
    model = model.set('zoomFactor', zoomFactor);
  return model;
}

function startEditingContent({ model, topicKey }: BaseCanvasModelModifierArg) {
  return focusTopic({
    model,
    topicKey,
    focusMode: FocusMode.EDITING_CONTENT
  });
}
function startEditingDesc({ model, topicKey }: BaseCanvasModelModifierArg) {
  const topic = model.getTopic(topicKey);
  const desc = topic.getBlock(BlockType.DESC);
  if (desc.block == null || desc.block.data == null) {
    model = CanvasModelModifier.setBlockData({
      model,
      topicKey,
      blockType: BlockType.DESC,
      data: ''
    });
  }
  model = CanvasModelModifier.focusTopic({
    model,
    topicKey,
    focusMode: FocusMode.EDITING_DESC
  });
  return model;
}

function dragAndDrop({ model, srcKey, dstKey, dropDir }) {
  const srcTopic = model.getTopic(srcKey);
  const dstTopic = model.getTopic(dstKey);

  const srcParentKey = srcTopic.parentKey;
  const srcParentTopic = model.getTopic(srcParentKey);
  let srcParentSubKeys = srcParentTopic.subKeys;
  const srcIndex = srcParentSubKeys.indexOf(srcKey);

  srcParentSubKeys = srcParentSubKeys.delete(srcIndex);

  if (dropDir === 'in') {
    let dstSubKeys = dstTopic.subKeys;
    dstSubKeys = dstSubKeys.push(srcKey);
    model = model.withMutations(m => {
      m.setIn(['topics', srcParentKey, 'subKeys'], srcParentSubKeys)
        .setIn(['topics', srcKey, 'parentKey'], dstKey)
        .setIn(['topics', dstKey, 'subKeys'], dstSubKeys)
        .setIn(['topics', dstKey, 'collapse'], false);
    });
  } else {
    const dstParentKey = dstTopic.parentKey;
    const dstParentItem = model.getTopic(dstParentKey);
    let dstParentSubKeys = dstParentItem.subKeys;
    const dstIndex = dstParentSubKeys.indexOf(dstKey);
    //src 和 dst 的父亲相同，这种情况要做特殊处理
    if (srcParentKey === dstParentKey) {
      let newDstParentSubKeys = List();
      dstParentSubKeys.forEach(key => {
        if (key !== srcKey) {
          if (key === dstKey) {
            if (dropDir === 'prev') {
              newDstParentSubKeys = newDstParentSubKeys.push(srcKey).push(key);
            } else {
              newDstParentSubKeys = newDstParentSubKeys.push(key).push(srcKey);
            }
          } else {
            newDstParentSubKeys = newDstParentSubKeys.push(key);
          }
        }
      });
      model = model.withMutations(m => {
        m.setIn(['topics', dstParentKey, 'subKeys'], newDstParentSubKeys);
      });
    } else {
      if (dropDir === 'prev') {
        dstParentSubKeys = dstParentSubKeys.insert(dstIndex, srcKey);
      } else if (dropDir === 'next') {
        dstParentSubKeys = dstParentSubKeys.insert(dstIndex + 1, srcKey);
      }
      model = model.withMutations(m => {
        m.setIn(['topics', srcParentKey, 'subKeys'], srcParentSubKeys)
          .setIn(['topics', srcKey, 'parentKey'], dstParentKey)
          .setIn(['topics', dstParentKey, 'subKeys'], dstParentSubKeys)
          .setIn(['topics', dstParentKey, 'collapse'], false);
      });
    }
  }
  return model;
}

export const CanvasModelModifier = {
  addChild,
  addSibling,
  toggleCollapse,
  collapseAll,
  expandAll,
  expandTo,
  focusTopic,
  setFocusMode,
  deleteTopic,
  setBlockData,
  deleteBlock,
  setStyle,
  clearAllCustomStyle,
  setTheme,
  setLayoutDir,
  setEditorRootTopicKey,
  setZoomFactor,
  startEditingContent,
  startEditingDesc,
  dragAndDrop
};
