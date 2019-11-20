import {
  ModelModifier,
  BlockType,
  FocusMode,
  Model,
  OpType
} from '@blink-mind/core';
import { List, Stack } from 'immutable';
import debug from 'debug';
const log = debug('plugin:operation');

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
    if (desc.block == null || desc.block.data == null) {
      model = ModelModifier.setDesc({ model, topicKey, data: '' });
    }
    return ModelModifier.focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.EDITING_DESC
    });
  };

  function dragAndDrop(props) {
    const { srcKey, dstKey, dropDir } = props;
    let { model } = props;
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
                newDstParentSubKeys = newDstParentSubKeys
                  .push(srcKey)
                  .push(key);
              } else {
                newDstParentSubKeys = newDstParentSubKeys
                  .push(key)
                  .push(srcKey);
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
    [OpType.START_EDITING_DESC, startEditingDesc],
    [OpType.DRAG_AND_DROP, dragAndDrop]
  ]);

  let undoStack = Stack<Model>();
  let redoStack = Stack<Model>();

  return {
    getAllowUndo(props) {
      const { model, opType } = props;
      if (opType) {
        switch (opType) {
          case OpType.FOCUS_TOPIC:
          case OpType.START_EDITING_CONTENT:
            return false;
          default:
            break;
        }
      }
      return model.config.allowUndo;
    },

    getUndoRedoStack() {
      return {
        undoStack,
        redoStack
      };
    },

    setUndoStack(props) {
      log('setUndoStack', props.undoStack);
      undoStack = props.undoStack;
    },

    setRedoStack(props) {
      log('setRedoStack', props.redoStack);
      redoStack = props.redoStack;
    },

    canUndo(props) {
      const { controller } = props;
      const { undoStack } = controller.run('getUndoRedoStack', props);
      const allowUndo = controller.run('getAllowUndo', props);
      return undoStack.size > 0 && allowUndo;
    },

    canRedo(props) {
      const { controller } = props;
      const { redoStack } = controller.run('getUndoRedoStack', props);
      const allowUndo = controller.run('getAllowUndo', props);
      return redoStack.size > 0 && allowUndo;
    },

    undo(props) {
      const { controller, model } = props;
      if (!controller.run('getAllowUndo', props)) {
        return;
      }
      const { undoStack, redoStack } = controller.run(
        'getUndoRedoStack',
        props
      );
      const newModel = undoStack.peek();
      if (!newModel) return;
      controller.run('setUndoStack', {
        ...props,
        undoStack: undoStack.shift()
      });
      controller.run('setRedoStack', {
        ...props,
        redoStack: redoStack.push(model)
      });
      log(newModel);
      controller.change(newModel);
    },

    redo(props) {
      const { controller, model } = props;
      if (!controller.run('getAllowUndo', props)) {
        return;
      }
      const { undoStack, redoStack } = controller.run(
        'getUndoRedoStack',
        props
      );
      const newModel = redoStack.peek();
      if (!newModel) return;
      controller.run('setUndoStack', {
        ...props,
        undoStack: undoStack.push(model)
      });
      controller.run('setRedoStack', {
        ...props,
        redoStack: redoStack.shift()
      });
      controller.change(newModel);
    },

    beforeOperation(props) {},
    operation(props) {
      const { opType, controller, model, opArray } = props;
      log('operation:', opType);
      log('model:', model);
      controller.run('beforeOperation', props);
      if (opType != null && opArray != null) {
        throw new Error('operation: opType and opArray conflict!');
      }
      if (controller.run('getAllowUndo', props)) {
        const { undoStack } = controller.run('getUndoRedoStack', props);
        controller.run('setUndoStack', {
          ...props,
          undoStack: undoStack.push(model)
        });
      }
      let newModel;
      if (opArray != null) {
        if (!Array.isArray(opArray)) {
          throw new Error('operation: the type of opArray must be array!');
        }
        newModel = opArray.reduce((acc, cur) => {
          const { opType } = cur;
          if (!OpMap.has(opType))
            throw new Error(`opType:${opType} not exist!`);
          const opFunc = OpMap.get(opType);
          const res = opFunc({ controller, ...cur, model: acc });
          return res;
          return acc;
        }, model);
      } else {
        if (!OpMap.has(opType)) throw new Error(`opType:${opType} not exist!`);
        const opFunc = OpMap.get(opType);
        newModel = opFunc(props);
      }
      log('newModel:', newModel);
      controller.change(newModel);
      controller.run('afterOperation', props);
    },
    afterOperation(props) {}
  };
}
