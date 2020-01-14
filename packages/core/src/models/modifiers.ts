import debug from 'debug';
import { ThemeType } from '../configs/theme/types';
import {
  DiagramLayoutType,
  FocusMode,
  KeyType,
  TopicRelationship
} from '../types';
import { createKey } from '../utils';
import { Block } from './block';
import { Model } from './model';
import { Topic } from './topic';
import { getAllSubTopicKeys, getKeyPath, getRelationship } from './utils';

const log = debug('modifier');

export type ModifierArg =
  | BaseModifierArg
  | SetTopicArg
  | SetBlockDataArg
  | SetFocusModeArg
  | SetTopicStyleArg
  | SetZoomFactorArg
  | SetThemeArg
  | SetLayoutDirArg;

export type BaseModifierArg = {
  model: Model;
  topicKey?: KeyType;
};

export type SetTopicArg = BaseModifierArg & {
  topic: Topic;
};

export type SetBlockDataArg = BaseModifierArg & {
  blockType: string;
  data: any;
  focusMode?: string;
};

export type DeleteBlockArg = BaseModifierArg & {
  blockType: string;
};

export type SetFocusModeArg = BaseModifierArg & {
  focusMode: string;
};

export type SetTopicStyleArg = BaseModifierArg & {
  style: string;
};

export type SetZoomFactorArg = BaseModifierArg & {
  zoomFactor: number;
};

export type SetThemeArg = BaseModifierArg & {
  theme: ThemeType;
};

export type SetLayoutDirArg = BaseModifierArg & {
  layoutDir: DiagramLayoutType;
};

export type ModifierResult = Model;

function toggleCollapse({ model, topicKey }: BaseModifierArg): ModifierResult {
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

function collapseAll({ model }: BaseModifierArg): ModifierResult {
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

function expandAll({ model }: BaseModifierArg): ModifierResult {
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

function expandTo({ model, topicKey }: BaseModifierArg): ModifierResult {
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

function addChild({ model, topicKey }: BaseModifierArg): ModifierResult {
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

function addSibling({ model, topicKey }: BaseModifierArg): ModifierResult {
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

function deleteTopic({ model, topicKey }: BaseModifierArg): ModifierResult {
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

function clearAllCustomStyle({ model }: BaseModifierArg): ModifierResult {
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
}: BaseModifierArg): ModifierResult {
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

export default {
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
  setZoomFactor
};
