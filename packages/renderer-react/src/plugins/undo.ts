import { Stack } from 'immutable';
import { DocModel } from '@blink-mind/core';

const log = require('debug')('plugin:undo');

export function UndoPlugin() {
  let undoStack = Stack<DocModel>();
  let redoStack = Stack<DocModel>();
  return {
    //是否允许undo
    getAllowUndo(ctx) {
      const { controller, allowUndo = true } = ctx;
      if (allowUndo === false) return false;
      return controller.run('customizeAllowUndo', ctx);
    },

    getUndoRedoStack() {
      return {
        undoStack,
        redoStack
      };
    },

    setUndoStack(ctx) {
      log('setUndoStack', ctx.undoStack);
      undoStack = ctx.undoStack;
    },

    setRedoStack(ctx) {
      log('setRedoStack', ctx.redoStack);
      redoStack = ctx.redoStack;
    },

    canUndo(ctx) {
      const { controller } = ctx;
      const isOperationEnabled = controller.run('isOperationEnabled', ctx);
      if (!isOperationEnabled) return false;
      const { undoStack } = controller.run('getUndoRedoStack', ctx);
      const allowUndo = controller.run('getAllowUndo', ctx);
      return undoStack.size > 0 && allowUndo;
    },

    canRedo(ctx) {
      const { controller } = ctx;
      const isOperationEnabled = controller.run('isOperationEnabled', ctx);
      if (!isOperationEnabled) return false;
      const { redoStack } = controller.run('getUndoRedoStack', ctx);
      const allowUndo = controller.run('getAllowUndo', ctx);
      return redoStack.size > 0 && allowUndo;
    },

    undo(ctx) {
      const { controller, docModel } = ctx;
      if (!controller.run('getAllowUndo', ctx)) {
        return;
      }
      const { undoStack, redoStack } = controller.run('getUndoRedoStack', ctx);
      const newDocModel = undoStack.peek();
      if (!newDocModel) return;
      controller.run('setUndoStack', {
        ...ctx,
        undoStack: undoStack.shift()
      });
      controller.run('setRedoStack', {
        ...ctx,
        redoStack: redoStack.push(docModel)
      });
      log('undo', newDocModel.currentSheetModel.topics);
      controller.change(newDocModel);
    },

    redo(ctx) {
      const { controller, docModel } = ctx;
      if (!controller.run('getAllowUndo', ctx)) {
        return;
      }
      const { undoStack, redoStack } = controller.run('getUndoRedoStack', ctx);
      const newDocModel = redoStack.peek();
      if (!newDocModel) return;
      controller.run('setUndoStack', {
        ...ctx,
        undoStack: undoStack.push(docModel)
      });
      controller.run('setRedoStack', {
        ...ctx,
        redoStack: redoStack.shift()
      });
      log('redo', newDocModel.currentSheetModel.topics);
      controller.change(newDocModel);
    }
  };
}
