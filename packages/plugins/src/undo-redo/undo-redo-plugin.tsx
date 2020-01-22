import {
  iconClassName,
  IconName,
  ToolbarItem,
  ToolbarItemConfigs
} from '@blink-mind/renderer-react';
import * as React from 'react';

export function UndoRedoPlugin() {
  function ToolbarItemUndo(props) {
    const { controller } = props;
    const onClickUndo = () => {
      controller.run('undo', props);
    };
    const canUndo = controller.run('canUndo', props);
    return (
      <ToolbarItem
        className={iconClassName(IconName.UNDO)}
        disabled={!canUndo}
        onClick={onClickUndo}
        {...props}
      />
    );
  }

  function ToolbarItemRedo(props) {
    const { controller } = props;
    const onClickRedo = () => {
      controller.run('redo', props);
    };
    const canUndo = controller.run('canRedo', props);
    return (
      <ToolbarItem
        className={iconClassName(IconName.REDO)}
        disabled={!canUndo}
        onClick={onClickRedo}
        {...props}
      />
    );
  }

  return {
    customizeToolbar(props, next): ToolbarItemConfigs {
      const res: ToolbarItemConfigs = next();
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
