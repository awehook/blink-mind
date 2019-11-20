import { BlockType, FocusMode } from '../../types';
import { Topic } from '../topic';
import { Block } from '../block';
import { IModifierArg, IModifierResult } from '../../interfaces';
import { createKey } from '../../utils';
import { getAllSubTopicKeys } from '../utils';
import debug from 'debug';

const log = debug('modifier');

function toggleCollapse({ model, topicKey }: IModifierArg): IModifierResult {
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
  return model;
}

function setTopic({ model, topic }: IModifierArg): IModifierResult {
  model = model.setIn(['topics', topic.key], topic);
  return model;
}

function focusTopic({
  model,
  topicKey,
  focusMode
}: IModifierArg): IModifierResult {
  log('focus topic');
  if (topicKey !== model.focusKey) model = model.set('focusKey', topicKey);
  if (focusMode !== model.focusMode) model = model.set('focusMode', focusMode);
  return model;
}

function addChild({ model, topicKey }: IModifierArg): IModifierResult {
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

function addSibling({ model, topicKey }: IModifierArg): IModifierResult {
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

function deleteTopic({ model, topicKey }: IModifierArg): IModifierResult {
  if (topicKey === model.rootTopicKey) return model;
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

function setContent({ model, topicKey, data }: IModifierArg): IModifierResult {
  const topic = model.getTopic(topicKey);
  if (topic) {
    const { index, block } = topic.getBlock(BlockType.CONTENT);
    if (block.data !== data) {
      model = model.updateIn(
        ['topics', topicKey, 'blocks', index, 'data'],
        dt => data
      );
    }
    return focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.EDITING_CONTENT
    });
  }
  return model;
}

function setStyle({ model, topicKey, style }: IModifierArg): IModifierResult {
  const topic = model.getTopic(topicKey);
  if (topic) {
    if (style !== topic.style) {
      model = model.updateIn(['topics', topicKey, 'style'], s => style);
    }
  }
  return model;
}

function setDesc({ model, topicKey, data }: IModifierArg): IModifierResult {
  const topic = model.getTopic(topicKey);
  if (topic) {
    const { index, block } = topic.getBlock(BlockType.DESC);
    if (index === -1) {
      model = model.updateIn(['topics', topicKey, 'blocks'], blocks =>
        blocks.push(
          Block.create({
            type: BlockType.DESC,
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
    return focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.EDITING_DESC
    });
  }
  return model;
}

function setTheme({ model, theme }: IModifierArg): IModifierResult {
  model = model.setIn(['config', 'theme'], theme);
  return model;
}

function setLayoutDir({ model, layoutDir }: IModifierArg): IModifierResult {
  if (model.config.layoutDir === layoutDir) return model;
  model = model.setIn(['config', 'layoutDir'], layoutDir);
  return model;
}

export default {
  addChild,
  addSibling,
  toggleCollapse,
  focusTopic,
  deleteTopic,
  setContent,
  setDesc,
  setStyle,
  setTheme,
  setLayoutDir
};
