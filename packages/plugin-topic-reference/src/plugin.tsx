import {
  BaseModifierArg,
  FocusMode,
  KeyType,
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
import { Checkbox } from '@blueprintjs/core';
import { List } from 'immutable';
import { useState } from 'react';
import { ReferenceTopicRecord } from './reference-topic-record';
import { TopicBlockReference } from './topic-block-reference';

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

  function TopicReferenceCheckbox(props) {
    const { topicKey } = props;
    const [checked, setChecked] = useState(selectedTopicKeys.has(topicKey));
    const checkboxProps = {
      checked,
      onChange: () => {
        if (selectedTopicKeys.has(topicKey)) {
          selectedTopicKeys.delete(topicKey);
        } else {
          selectedTopicKeys.add(topicKey);
        }
        setChecked(!checked);
      }
    };
    return <Checkbox {...checkboxProps}></Checkbox>;
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
            icon={Icon('topology')}
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
        const checkBoxProps = { ...props, key: 'checkbox' };
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
    }
  };
}
