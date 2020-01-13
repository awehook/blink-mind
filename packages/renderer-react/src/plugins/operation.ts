import {
  BaseModifierArg,
  BlockType,
  FocusMode,
  getAllSubTopicKeys,
  Model,
  ModelModifier,
  OpType
} from '@blink-mind/core';
import debug from 'debug';
import { List, Stack } from 'immutable';
import {
  collapseRefKey,
  contentEditorRefKey,
  contentRefKey,
  descEditorRefKey,
  dropAreaRefKey,
  linksRefKey,
  linksSvgRefKey,
  topicRefKey,
  topicWidgetRefKey
} from '../utils';
const log = debug('plugin:operation');

export function OperationPlugin() {
  const startEditingContent = ({ model, topicKey }: BaseModifierArg) => {
    return ModelModifier.focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.EDITING_CONTENT
    });
  };
  const startEditingDesc = ({ model, topicKey }: BaseModifierArg) => {
    const topic = model.getTopic(topicKey);
    const desc = topic.getBlock(BlockType.DESC);
    if (desc.block == null || desc.block.data == null) {
      model = ModelModifier.setBlockData({
        model,
        topicKey,
        blockType: BlockType.DESC,
        data: ''
      });
    }
    model = ModelModifier.focusTopic({
      model,
      topicKey,
      focusMode: FocusMode.EDITING_DESC
    });
    return model;
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
    [OpType.COLLAPSE_ALL, ModelModifier.collapseAll],
    [OpType.EXPAND_ALL, ModelModifier.expandAll],
    [OpType.EXPAND_TO, ModelModifier.expandTo],
    [OpType.ADD_CHILD, ModelModifier.addChild],
    [OpType.ADD_SIBLING, ModelModifier.addSibling],
    [OpType.DELETE_TOPIC, ModelModifier.deleteTopic],
    [OpType.FOCUS_TOPIC, ModelModifier.focusTopic],
    [OpType.SET_FOCUS_MODE, ModelModifier.setFocusMode],
    [OpType.SET_STYLE, ModelModifier.setStyle],
    [OpType.CLEAR_ALL_CUSTOM_STYLE, ModelModifier.clearAllCustomStyle],
    [OpType.SET_THEME, ModelModifier.setTheme],
    [OpType.SET_TOPIC_BLOCK, ModelModifier.setBlockData],
    [OpType.DELETE_TOPIC_BLOCK, ModelModifier.deleteBlock],
    [OpType.START_EDITING_CONTENT, startEditingContent],
    [OpType.START_EDITING_DESC, startEditingDesc],
    [OpType.DRAG_AND_DROP, dragAndDrop],
    [OpType.SET_EDITOR_ROOT, ModelModifier.setEditorRootTopicKey],
    [OpType.SET_LAYOUT_DIR, ModelModifier.setLayoutDir]
  ]);

  let undoStack = Stack<Model>();
  let redoStack = Stack<Model>();

  let enabled = true;
  let whiteListOperation = new Set<string>();

  return {
    isOperationEnabled(props) {
      return enabled;
    },

    enableOperation() {
      enabled = true;
    },

    disableOperation({ whiteList }) {
      enabled = false;
      if (whiteList) whiteListOperation = new Set(whiteList);
      else whiteListOperation.clear();
    },

    /** plugin can extend Operation Map
     * for example: A plugin can write a function
     * getOpMap(props,next) {
     *   let opMap = next();
     *   opMap.set("OpTypeName",opFunc);
     *   return opMap;
     * }
     * @param props
     */
    getOpMap(props) {
      return OpMap;
    },
    getAllowUndo(props) {
      const { model, opType } = props;
      if (opType) {
        switch (opType) {
          case OpType.FOCUS_TOPIC:
          case OpType.START_EDITING_CONTENT:
          case OpType.START_EDITING_DESC:
            return false;
          default:
            break;
        }
      }
      switch (model.focusMode) {
        case 'EDITING_DESC':
        case 'EDITING_CONTENT':
          return false;
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

    //TODO 有空重构这个函数
    operation(props) {
      const { controller, opType, model, opArray, callback } = props;
      if (opArray != null && !Array.isArray(opArray)) {
        throw new Error('operation: the type of opArray must be array!');
      }
      if (opType != null && opArray != null) {
        throw new Error('operation: opType and opArray conflict!');
      }
      const isOperationEnabled = controller.run('isOperationEnabled', props);
      if (!isOperationEnabled) {
        // warning(
        //   true,
        //   `You have disabled operation,but you run operation ${props} now!`
        // );
        if (whiteListOperation.size === 0) return;

        if (opArray != null) {
          const opNotInWhiteList = opArray.filter(
            op => !whiteListOperation.has(op.opType)
          );
          if (opNotInWhiteList && opNotInWhiteList.length > 0) {
            return;
          }
        } else if (!whiteListOperation.has(opType)) {
          return;
        }
      }

      log('operation:', opType);
      log('operation:', model);
      log('operation:', props);

      const opMap = controller.run('getOpMap', props);
      controller.run('beforeOperation', props);
      if (controller.run('getAllowUndo', props)) {
        const { undoStack } = controller.run('getUndoRedoStack', props);
        controller.run('setUndoStack', {
          ...props,
          undoStack: undoStack.push(model)
        });
      }
      let newModel;

      if (opArray != null) {
        newModel = opArray.reduce((acc, cur) => {
          const { opType } = cur;
          if (!opMap.has(opType))
            throw new Error(`opType:${opType} not exist!`);
          const opFunc = opMap.get(opType);
          const opFuncProps = { controller, ...cur, model: acc };
          let res = controller.run('beforeOpFunction', opFuncProps);
          res = opFunc({ ...opFuncProps, model: res });
          res = controller.run('afterOpFunction', {
            ...opFuncProps,
            model: res
          });
          return res;
        }, model);
      } else {
        if (!opMap.has(opType)) throw new Error(`opType:${opType} not exist!`);
        const opFunc = opMap.get(opType);
        newModel = controller.run('beforeOpFunction', props);
        newModel = opFunc({ ...props, model: newModel });
        newModel = controller.run('afterOpFunction', {
          ...props,
          model: newModel
        });
      }
      log('newModel:', newModel);
      controller.change(newModel, callback ? callback(newModel) : null);
      controller.run('afterOperation', props);
    },

    deleteRefKey(props) {
      const { model, topicKey, deleteRef } = props;
      const allSubKeys = getAllSubTopicKeys(model, topicKey);
      allSubKeys.push(topicKey);
      for (const key of allSubKeys) {
        deleteRef(linksRefKey(key));
        deleteRef(linksSvgRefKey(key));
        deleteRef(contentRefKey(key));
        deleteRef(contentEditorRefKey(key));
        deleteRef(descEditorRefKey(key));
        deleteRef(topicWidgetRefKey(key));
        deleteRef(topicRefKey(key));
        deleteRef(collapseRefKey(key));
        deleteRef(dropAreaRefKey(key, 'next'));
        deleteRef(dropAreaRefKey(key, 'prev'));
      }
    },

    // 在整个Operation执行之前被调用
    beforeOperation(props) {},
    afterOperation(props) {},

    // 在单个OpFunction执行之前被调用
    beforeOpFunction(props) {
      const { controller, opType, model, topicKey } = props;
      if (
        opType === OpType.DELETE_TOPIC &&
        topicKey !== model.editorRootTopicKey
      ) {
        controller.run('deleteRefKey', props);
      }
      return model;
    },

    afterOpFunction(props) {
      return props.model;
    },

    openNewModel(props) {
      const { model, controller, newModel } = props;
      controller.run('deleteRefKey', {
        ...props,
        topicKey: model.rootTopicKey
      });
      controller.run('operation', {
        ...props,
        opType: OpType.EXPAND_TO,
        topicKey: newModel.focusKey,
        model: newModel,
        callback: model => () => {
          controller.run('moveTopicToCenter', {
            ...props,
            model,
            topicKey: model.focusKey
          });
        }
      });
    }
  };
}
