import debug from 'debug';
import htmlToText from 'html-to-text';
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
import { Config, ConfigRecordType } from './config';
import { DescBlockData } from './desc-block-data';
import { SheetModel } from './sheet-model';
import { Topic } from './topic';
import {
  getAllSubTopicKeys,
  getKeyPath,
  getPrevTopicKey,
  getRelationship
} from './utils';

const log = debug('modifier');

type ModifierArg =
  | BaseSheetModelModifierArg
  | SetTopicArg
  | setTopicBlockDataArg
  | SetFocusModeArg
  | SetTopicStyleArg
  | SetZoomFactorArg
  | SetThemeArg
  | SetLayoutDirArg
  | SetConfigArg;

export type BaseSheetModelModifierArg = {
  model: SheetModel;
  topicKey?: KeyType;
  topicKeys?: Array<KeyType>;
};

type SetTopicArg = BaseSheetModelModifierArg & {
  topic: Topic;
};

type setTopicBlockDataArg = BaseSheetModelModifierArg & {
  blockType: string;
  data: any;
  focusMode?: string;
};

type DeleteTopicBlockArg = BaseSheetModelModifierArg & {
  blockType: string;
};

type SetFocusModeArg = BaseSheetModelModifierArg & {
  focusMode: string;
};

type SetTopicStyleArg = BaseSheetModelModifierArg & {
  style: string;
};

type SetZoomFactorArg = BaseSheetModelModifierArg & {
  zoomFactor: number;
};

type SetThemeArg = BaseSheetModelModifierArg & {
  theme: ThemeType;
};

type SetLayoutDirArg = BaseSheetModelModifierArg & {
  layoutDir: DiagramLayoutType;
};

type SetConfigArg = BaseSheetModelModifierArg & {
  config: Partial<ConfigRecordType>;
};

export type SheetModelModifierResult = SheetModel;

function toggleCollapse({
  model,
  topicKey
}: BaseSheetModelModifierArg): SheetModelModifierResult {
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

function collapseAll({
  model
}: BaseSheetModelModifierArg): SheetModelModifierResult {
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

function expandAll({
  model
}: BaseSheetModelModifierArg): SheetModelModifierResult {
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
}: BaseSheetModelModifierArg): SheetModelModifierResult {
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
  focusMode = FocusMode.NORMAL
}: SetFocusModeArg): SheetModelModifierResult {
  log('focus topic', focusMode);
  if (!model.topics.has(topicKey)) {
    throw new Error(`focus key ${topicKey} is not in model`);
  }
  if (topicKey !== model.focusKey) model = model.set('focusKey', topicKey);
  // if (focusMode !== model.focusMode) model = model.set('focusMode', focusMode);
  model = model.set('focusMode', focusMode);
  if (model.selectedKeys != null) model = model.set('selectedKeys', null);
  return model;
}

function setFocusMode({
  model,
  focusMode
}: SetFocusModeArg): SheetModelModifierResult {
  log('setFocusMode');
  // SHOW_POPUP一定要重新设置, 因为可能dialogType 改变了
  if (focusMode !== model.focusMode || focusMode === FocusMode.SHOW_POPUP)
    model = model.set('focusMode', focusMode);
  return model;
}

function addChild({
  model,
  topicKey,
  addAtFront = false
}: BaseSheetModelModifierArg & {
  addAtFront: boolean;
}): SheetModelModifierResult {
  log('addChild:', topicKey);
  let topic = model.getTopic(topicKey);
  if (topic) {
    const child = Topic.create({ key: createKey(), parentKey: topic.key });
    topic = topic
      .set('collapse', false)
      .update('subKeys', subKeys =>
        addAtFront ? subKeys.unshift(child.key) : subKeys.push(child.key)
      );
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
  topicKey,
  content
}: BaseSheetModelModifierArg & {
  content?: string;
}): SheetModelModifierResult {
  if (topicKey === model.rootTopicKey) return model;
  const topic = model.getTopic(topicKey);
  if (topic) {
    const pItem = model.getTopic(topic.parentKey);
    const idx = pItem.subKeys.indexOf(topicKey);
    const sibling = Topic.create({
      key: createKey(),
      parentKey: pItem.key,
      content
    });
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

function topicContentToPlainText({
  model,
  topicKey
}: BaseSheetModelModifierArg): SheetModelModifierResult {
  const content = model.getTopic(topicKey).getBlock(BlockType.CONTENT).block
    .data;
  const data = htmlToText.fromString(content, { preserveNewlines: true });
  return setTopicBlockContentData({ model, topicKey, data });
}

function deleteTopic({
  model,
  topicKey
}: BaseSheetModelModifierArg): SheetModelModifierResult {
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
        m.set('focusKey', getPrevTopicKey(model, topicKey)).set(
          'focusMode',
          FocusMode.EDITING_CONTENT
        );
    });
  }

  return model;
}

function deleteTopics({ model, topicKeys }): SheetModelModifierResult {
  if (topicKeys == null) topicKeys = model.focusOrSelectedKeys;
  topicKeys.forEach(topicKey => {
    model = deleteTopic({ model, topicKey });
  });
  return model;
}

/**
 * setTopicBlockData of one topic
 * @param model
 * @param topicKey
 * @param blockType
 * @param focusMode
 * @param data
 */
function setTopicBlockData({
  model,
  topicKey,
  blockType,
  focusMode,
  data
}: setTopicBlockDataArg): SheetModelModifierResult {
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

function setTopicBlockContentData({
  model,
  topicKey,
  focusMode = null,
  data
}): SheetModelModifierResult {
  return setTopicBlockData({
    model,
    topicKey,
    focusMode,
    data,
    blockType: BlockType.CONTENT
  });
}

function deleteTopicBlock({ model, topicKey, blockType }: DeleteTopicBlockArg) {
  const topic = model.getTopic(topicKey);
  if (topic) {
    const { index } = topic.getBlock(blockType);
    if (index !== -1) {
      model = model.updateIn(['topics', topicKey, 'blocks'], blocks =>
        blocks.delete(index)
      );
    }
    model = setFocusMode({
      model,
      focusMode: FocusMode.NORMAL
    });
  }
  return model;
}

function deleteTopicBlockDesc({ model, topicKey }: BaseSheetModelModifierArg) {
  return deleteTopicBlock({ model, topicKey, blockType: BlockType.DESC });
}

function setStyle({
  model,
  topicKey,
  style
}: SetTopicStyleArg): SheetModelModifierResult {
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
}: BaseSheetModelModifierArg): SheetModelModifierResult {
  model = model.withMutations(model => {
    model.topics.keySeq().forEach(key => {
      model.setIn(['topics', key, 'style'], null);
    });
  });
  return model;
}

function setTheme({ model, theme }: SetThemeArg): SheetModelModifierResult {
  model = model.setIn(['config', 'theme'], theme);
  return model;
}

function setLayoutDir({
  model,
  layoutDir
}: SetLayoutDirArg): SheetModelModifierResult {
  if (model.config.layoutDir === layoutDir) return model;
  model = model.setIn(['config', 'layoutDir'], layoutDir);
  return model;
}

function setConfig({ model, config }: SetConfigArg) {
  return model.set('config', model.config.merge(config));
}

function setEditorRootTopicKey({
  model,
  topicKey
}: BaseSheetModelModifierArg): SheetModelModifierResult {
  if (model.editorRootTopicKey !== topicKey)
    model = model.set('editorRootTopicKey', topicKey);
  if (model.getTopic(topicKey).collapse)
    model = model.setIn(['topics', topicKey, 'collapse'], false);
  return model;
}

function setZoomFactor({
  model,
  zoomFactor
}: SetZoomFactorArg): SheetModelModifierResult {
  if (model.zoomFactor !== zoomFactor)
    model = model.set('zoomFactor', zoomFactor);
  return model;
}

function startEditingContent({ model, topicKey }: BaseSheetModelModifierArg) {
  return focusTopic({
    model,
    topicKey,
    focusMode: FocusMode.EDITING_CONTENT
  });
}
function startEditingDesc({ model, topicKey }: BaseSheetModelModifierArg) {
  const topic = model.getTopic(topicKey);
  const desc = topic.getBlock(BlockType.DESC);
  if (desc.block == null || desc.block.data == null) {
    model = SheetModelModifier.setTopicBlockData({
      model,
      topicKey,
      blockType: BlockType.DESC,
      data: new DescBlockData({ kind: 'html', data: '', collapse: false })
    });
  }
  model = SheetModelModifier.focusTopic({
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

function swapUp({
  model,
  topicKeys
}: BaseSheetModelModifierArg): SheetModelModifierResult {
  if (topicKeys == null) topicKeys = model.focusOrSelectedKeys;
  const firstKey = topicKeys[0];
  const parent = model.getParentTopic(firstKey);
  const idxArray = [];

  for (const itemKey of topicKeys) {
    const idx = parent.subKeys.indexOf(itemKey);
    // 如果topicKeys不是sibling 关系
    if (idx === -1) return model;
    idxArray.push(idx);
  }
  // 对序号进行排序
  idxArray.sort((a, b) => a - b);

  const firstIdx = idxArray[0];
  if (firstIdx === 0) {
    return model;
  } else {
    const sortedItemKeys = idxArray.map(idx => parent.subKeys.get(idx));
    model = model.updateIn(['topics', parent.key, 'subKeys'], subKeys =>
      subKeys
        .splice(idxArray[0], idxArray.length)
        .splice(idxArray[0] - 1, 0, ...sortedItemKeys)
    );
  }
  return model;
}

function swapDown({
  model,
  topicKeys
}: BaseSheetModelModifierArg): SheetModelModifierResult {
  if (topicKeys == null) topicKeys = model.focusOrSelectedKeys;
  const firstKey = topicKeys[0];
  const parent = model.getParentTopic(firstKey);
  const idxArray = [];

  for (const itemKey of topicKeys) {
    const idx = parent.subKeys.indexOf(itemKey);
    if (idx === -1) return model;
    idxArray.push(idx);
  }
  idxArray.sort((a, b) => a - b);

  const lastIdx = idxArray[idxArray.length - 1];
  if (lastIdx === parent.subKeys.size - 1) {
    return model;
  } else {
    const sortedItemKeys = idxArray.map(idx => parent.subKeys.get(idx));
    model = model.updateIn(['topics', parent.key, 'subKeys'], subKeys =>
      subKeys
        .splice(idxArray[0], idxArray.length)
        .splice(idxArray[0] + 1, 0, ...sortedItemKeys)
    );
  }
  return model;
}

function addMultiSibling({
  model,
  topicKey,
  contentArray,
  topicArray
}: BaseSheetModelModifierArg & {
  contentArray?: string[];
  topicArray?: Array<Topic>;
}) {
  const topic = model.getTopic(topicKey);
  const parentKey = topic.parentKey;
  const parentTopic = model.getTopic(parentKey);
  const idx = parentTopic.subKeys.indexOf(topicKey);
  if (contentArray) {
    const siblings = contentArray.map(content =>
      Topic.create({
        key: createKey(),
        parentKey,
        content
      })
    );
    const siblingsKeys = siblings.map(s => s.key);
    model = model.withMutations(model => {
      siblings.forEach(sibling => {
        model.update('topics', topics => topics.set(sibling.key, sibling));
      });
      model.updateIn(['topics', parentKey, 'subKeys'], subKeys =>
        subKeys.splice(idx + 1, 0, ...siblingsKeys)
      );
    });
    model = focusTopic({
      model,
      topicKey: siblingsKeys[siblingsKeys.length - 1],
      focusMode: FocusMode.EDITING_CONTENT
    });
  } else if (topicArray) {
  }
  return model;
}

function addMultiChild({
  model,
  topicKey,
  addAtFront = false,
  contentArray,
  topicArray
}: BaseSheetModelModifierArg & {
  addAtFront?: boolean;
  contentArray?: string[];
  topicArray?: Array<Topic>;
}) {
  if (contentArray) {
    topicArray = contentArray.map(content =>
      Topic.create({
        key: createKey(),
        parentKey: topicKey,
        content
      })
    );
  }

  const childKeys = topicArray
    .filter(s => s.parentKey === topicKey)
    .map(s => s.key);
  model = model.withMutations(model => {
    topicArray.forEach(topic => {
      model.update('topics', topics_ => topics_.set(topic.key, topic));
    });
    model.updateIn(['topics', topicKey, 'subKeys'], subKeys =>
      addAtFront ? subKeys.unshift(...childKeys) : subKeys.push(...childKeys)
    );
  });
  model = focusTopic({
    model,
    topicKey: childKeys[childKeys.length - 1],
    focusMode: FocusMode.EDITING_CONTENT
  });
  return model;
}

function addMultiTopics({ model, topics }) {
  model = model.withMutations(model => {
    topics.forEach(topic => {
      model.update('topics', topics_ => topics_.set(topic.key, topic));
    });
  });
  return model;
}

export const SheetModelModifier = {
  addChild,
  addSibling,
  addMultiTopics,
  addMultiChild,
  addMultiSibling,
  toggleCollapse,
  collapseAll,
  expandAll,
  expandTo,
  focusTopic,
  topicContentToPlainText,
  setFocusMode,
  deleteTopic,
  deleteTopics,
  setTopicBlockData,
  setTopicBlockContentData,
  deleteTopicBlock,
  setStyle,
  clearAllCustomStyle,
  setConfig,
  setTheme,
  setLayoutDir,
  setEditorRootTopicKey,
  setZoomFactor,
  startEditingContent,
  startEditingDesc,
  dragAndDrop,
  swapUp,
  swapDown
};
