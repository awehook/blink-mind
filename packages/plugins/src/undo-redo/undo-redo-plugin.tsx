import {
  ElementItemConfigs,
  IconName,
  ToolbarItem
} from '@blink-mind/renderer-react';
import * as React from 'react';
import { ToolbarGroupItem } from '../../../renderer-react/src/components/common';

export function ToolbarGroupItemUndoRedo(props) {
  const { controller } = props;
  const onClickUndo = () => {
    controller.run('undo', props);
  };
  const onClickRedo = () => {
    controller.run('redo', props);
  };
  const canUndo = controller.run('canUndo', props);
  const canRedo = controller.run('canRedo', props);
  const undoProps = {
    ...props,
    iconName: IconName.UNDO,
    disabled: !canUndo,
    onClick: onClickUndo
  };

  const redoProps = {
    ...props,
    iconName: IconName.REDO,
    disabled: !canRedo,
    onClick: onClickRedo
  };

  return <ToolbarGroupItem items={[undoProps, redoProps]} />;
}

export function ToolbarItemUndo(props) {
  const { controller } = props;
  const onClickUndo = () => {
    controller.run('undo', props);
  };
  const canUndo = controller.run('canUndo', props);
  return (
    <ToolbarItem
      iconName={IconName.UNDO}
      disabled={!canUndo}
      onClick={onClickUndo}
      {...props}
    />
  );
}

export function ToolbarItemRedo(props) {
  const { controller } = props;
  const onClickRedo = () => {
    controller.run('redo', props);
  };
  const canUndo = controller.run('canRedo', props);
  return (
    <ToolbarItem
      iconName={IconName.REDO}
      disabled={!canUndo}
      onClick={onClickRedo}
      {...props}
    />
  );
}

export function UndoRedoPlugin() {
  return {
    customizeToolbar(props, next): ElementItemConfigs {
      const res: ElementItemConfigs = next();
      res.push(
        {
          order: 200,
          element: ToolbarItemUndo
        },
        {
          order: 210,
          element: ToolbarItemRedo
        }
      );
      return res;
    }
  };
}
