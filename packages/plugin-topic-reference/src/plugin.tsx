import {
  BaseModifierArg,
  FocusMode,
  KeyType,
  Model,
  ModelModifier,
  OpType
} from '@blink-mind/core';
import { Icon, PropKey } from '@blink-mind/renderer-react';
import { MenuDivider, MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { AddReferenceTopicPanel } from './add-reference-topic-panel';
import {
  BLOCK_TYPE_REFERENCE_TOPIC,
  FOCUS_MODE_SET_REFERENCE_TOPICS,
  OP_TYPE_SET_REFERENCE_TOPICS,
  OP_TYPE_START_SET_REFERENCE_TOPICS
} from './utils';

import { IControllerRunContext } from '@blink-mind/core/src/interfaces';
import { List } from 'immutable';
import { ReferenceTopicRecord } from './reference-topic-record';
import { TopicBlockReference } from './topic-block-reference';
import { TopicReferenceCheckbox } from './topic-reference-checkbox';

export default function TopicReferencePlugin() {
  let selectedTopicKeys = new Set();
  function startSetReferenceTopics({ model, topicKey }: BaseModifierArg) {
    const { block } = model
      .getTopic(topicKey)
      .getBlock(BLOCK_TYPE_REFERENCE_TOPIC);
    const data: ReferenceTopicRecord = block
      ? block.data
      : new ReferenceTopicRecord();
    const referenceKeys = data.reference.toArray();
    selectedTopicKeys = new Set(referenceKeys);

    model = ModelModifier.focusTopic({
      model,
      topicKey,
      focusMode: FOCUS_MODE_SET_REFERENCE_TOPICS
    });
    return model;
  }

  function setReferenceTopics({
    model,
    topicKey,
    referenceKeys
  }: BaseModifierArg & { referenceKeys: KeyType[] }) {
    const topic = model.getTopic(topicKey);
    const { block } = topic.getBlock(BLOCK_TYPE_REFERENCE_TOPIC);
    const oldData: ReferenceTopicRecord = block
      ? block.data
      : new ReferenceTopicRecord();
    const oldReferenceKeys: KeyType[] = oldData.reference.toArray();
    const addedKeys =
      referenceKeys.filter(v => oldReferenceKeys.indexOf(v) === -1) || [];
    const deletedKeys =
      oldReferenceKeys.filter(v => referenceKeys.indexOf(v) === -1) || [];
    for (const key of addedKeys) {
      const { block } = model
        .getTopic(key)
        .getBlock(BLOCK_TYPE_REFERENCE_TOPIC);
      let data: ReferenceTopicRecord = block
        ? block.data
        : new ReferenceTopicRecord();
      data = data.update('referenced', referenced => referenced.push(topicKey));
      model = ModelModifier.setBlockData({
        model,
        topicKey: key,
        blockType: BLOCK_TYPE_REFERENCE_TOPIC,
        data
      });
    }
    for (const key of deletedKeys) {
      const { block } = model
        .getTopic(key)
        .getBlock(BLOCK_TYPE_REFERENCE_TOPIC);
      if (!block || !block.data || !block.data.reference) {
        throw new Error('BLOCK_TYPE_REFERENCED_TOPIC logic error');
      }
      let data: ReferenceTopicRecord = block.data;
      data = data.update('referenced', referenced =>
        referenced.delete(referenced.indexOf(key))
      );
      model = ModelModifier.setBlockData({
        model,
        topicKey: key,
        blockType: BLOCK_TYPE_REFERENCE_TOPIC,
        data
      });
    }

    model = ModelModifier.setBlockData({
      model,
      topicKey,
      blockType: BLOCK_TYPE_REFERENCE_TOPIC,
      data: oldData.set('reference', List(referenceKeys))
    });
    model = ModelModifier.focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.NORMAL
    });
    return model;
  }

  return {
    customizeTopicContextMenu(props, next) {
      const { controller } = props;
      function onClickSetReferenceTopics(e) {
        controller.run('operation', {
          ...props,
          opType: OP_TYPE_START_SET_REFERENCE_TOPICS
        });
        controller.run('disableOperation', {
          ...props,
          whiteList: [OpType.TOGGLE_COLLAPSE]
        });
      }
      return (
        <>
          {next()}
          <MenuDivider />
          <MenuItem
            icon={Icon('reference')}
            text="Set Reference Topics"
            onClick={onClickSetReferenceTopics}
          />
        </>
      );
    },
    getOpMap(props, next) {
      const opMap = next();
      opMap.set(OP_TYPE_START_SET_REFERENCE_TOPICS, startSetReferenceTopics);
      opMap.set(OP_TYPE_SET_REFERENCE_TOPICS, setReferenceTopics);
      return opMap;
    },
    beforeOpFunction(props, next) {
      let model: Model = next();
      const { opType, topicKey } = props;
      if (opType === OpType.DELETE_TOPIC) {
        const topic = model.getTopic(topicKey);
        const { block } = topic.getBlock(BLOCK_TYPE_REFERENCE_TOPIC);
        if (block) {
          const data: ReferenceTopicRecord = block.data;
          data.reference.forEach(key => {
            let data: ReferenceTopicRecord = model
              .getTopic(key)
              .getBlock(BLOCK_TYPE_REFERENCE_TOPIC).block.data;
            data = data.update('referenced', referenced =>
              referenced.delete(referenced.indexOf(topicKey))
            );
            model = ModelModifier.setBlockData({
              ...props,
              model,
              topicKey: key,
              blockType: BLOCK_TYPE_REFERENCE_TOPIC,
              data
            });
          });

          // 被引用的
          data.referenced.forEach(key => {
            let data: ReferenceTopicRecord = model
              .getTopic(key)
              .getBlock(BLOCK_TYPE_REFERENCE_TOPIC).block.data;
            data = data.update('reference', reference =>
              reference.delete(reference.indexOf(topicKey))
            );
            model = ModelModifier.setBlockData({
              ...props,
              model,
              topicKey: key,
              blockType: BLOCK_TYPE_REFERENCE_TOPIC,
              data
            });
          });
        }
      }
      return model;
    },
    renderDiagramCustomize(props: IControllerRunContext, next) {
      const { model, controller } = props;
      const zIndex =
        controller.getValue(PropKey.DIAGRAM_CUSTOMIZE_BASE_Z_INDEX) + 2;
      const res = next();
      if (model.focusMode === FOCUS_MODE_SET_REFERENCE_TOPICS) {
        const panelProps = {
          ...props,
          zIndex,
          topicKey: model.focusKey,
          key: 'AddReferenceTopicPanel'
        };
        res.push(<AddReferenceTopicPanel {...panelProps} />);
      }
      return res;
    },
    renderTopicContentOthers(props, next) {
      const { model, topicKey } = props;
      const res = next();
      if (
        model.focusMode === FOCUS_MODE_SET_REFERENCE_TOPICS &&
        model.focusKey !== topicKey
      ) {
        const checkBoxProps = { ...props, key: 'checkbox', selectedTopicKeys };
        const checkbox = <TopicReferenceCheckbox {...checkBoxProps} />;
        res.push(checkbox);
      }
      return res;
    },

    renderTopicBlock(props, next) {
      const { controller, block } = props;
      if (block.type === BLOCK_TYPE_REFERENCE_TOPIC) {
        return controller.run('renderTopicBlockReference', props);
      }
      return next();
    },

    renderTopicBlockReference(props, next) {
      return <TopicBlockReference {...props} />;
    },

    clearSelectedReferenceKeys() {
      selectedTopicKeys.clear();
    },

    getSelectedReferenceKeys() {
      return Array.from(selectedTopicKeys);
    },

    deserializeBlockData(props, next) {
      const { obj } = props;
      const { type, data } = obj;
      if (type === BLOCK_TYPE_REFERENCE_TOPIC) {
        const { reference, referenced } = data;
        return new ReferenceTopicRecord({
          reference: List(reference),
          referenced: List(referenced)
        });
      }
      return next();
    }
  };
}
