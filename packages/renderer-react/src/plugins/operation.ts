import { ModelModifier } from '@blink-mind/core';

export const OpType = {
  ADD_CHILD: 'ADD_CHILD',
  ADD_SIBLING: 'ADD_SIBLING',
  DELETE_TOPIC: 'DELETE_TOPIC',
  FOCUS_TOPIC: 'FOCUS_TOPIC',
  SET_STYLE: 'SET_STYLE'
};

export function OperationPlugin() {
  const OpMap = new Map([
    [OpType.ADD_CHILD, ModelModifier.addChild],
    [OpType.ADD_SIBLING, ModelModifier.addSibling],
    [OpType.DELETE_TOPIC, ModelModifier.deleteTopic],
    [OpType.FOCUS_TOPIC, ModelModifier.focusTopic],
    [OpType.SET_STYLE, ModelModifier.setStyle]
  ]);
  return {
    beforeOperation(props) {},
    operation(props) {
      const { opType, controller } = props;
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
