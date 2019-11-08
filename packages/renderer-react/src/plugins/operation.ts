import { ModelModifier, BlockType, FocusMode } from '@blink-mind/core';
import debug from 'debug';
const log = debug('plugin:operation');
export const OpType = {
  TOGGLE_COLLAPSE: 'TOGGLE_COLLAPSE',
  ADD_CHILD: 'ADD_CHILD',
  ADD_SIBLING: 'ADD_SIBLING',
  DELETE_TOPIC: 'DELETE_TOPIC',
  FOCUS_TOPIC: 'FOCUS_TOPIC',
  SET_STYLE: 'SET_STYLE',
  SET_TOPIC_CONTENT: 'SET_TOPIC_CONTENT',
  SET_TOPIC_DESC: 'SET_TOPIC_DESC',
  START_EDITING_CONTENT: 'START_EDITING_CONTENT',
  START_EDITING_DESC: 'START_EDITING_DESC'
};

export function OperationPlugin() {
  const startEditingContent = ({ model, topicKey }) => {
    return ModelModifier.focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.EDITING_CONTENT
    });
  };
  const startEditingDesc = ({ model, topicKey }) => {
    const topic = model.getTopic(topicKey);
    const desc = topic.getBlock(BlockType.DESC);
    if (desc.block === null) {
      model = ModelModifier.setDesc({ model, topicKey, desc: '' });
    }
    return ModelModifier.focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.EDITING_DESC
    });
  };
  const OpMap = new Map([
    [OpType.TOGGLE_COLLAPSE, ModelModifier.toggleCollapse],
    [OpType.ADD_CHILD, ModelModifier.addChild],
    [OpType.ADD_SIBLING, ModelModifier.addSibling],
    [OpType.DELETE_TOPIC, ModelModifier.deleteTopic],
    [OpType.FOCUS_TOPIC, ModelModifier.focusTopic],
    [OpType.SET_STYLE, ModelModifier.setStyle],
    [OpType.SET_TOPIC_CONTENT, ModelModifier.setContent],
    [OpType.SET_TOPIC_DESC, ModelModifier.setDesc],
    [OpType.START_EDITING_CONTENT, startEditingContent],
    [OpType.START_EDITING_DESC, startEditingDesc]
  ]);
  return {
    beforeOperation(props) {},
    operation(props) {
      const { opType, controller } = props;
      log('operation:', opType);
      controller.run('beforeOperation', props);
      if (OpMap.has(opType)) {
        const opFunc = OpMap.get(opType);
        controller.change(opFunc(props));
      }
      controller.run('afterOperation', props);
    },
    afterOperation(props) {}
  };
}
