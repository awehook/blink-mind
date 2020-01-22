import { DragDropState, RightTopPanelState } from '../types';
import { PropKey } from '../utils';

export function GetValuePlugin() {
  return {
    getValue(props, next) {
      const { propKey, controller, diagramState } = props;
      switch (propKey) {
        case PropKey.DIAGRAM_CUSTOMIZE_BASE_Z_INDEX:
          return 3;
        case PropKey.TOPIC_CONTEXT_MENU_ENABLED:
          return controller.run('isOperationEnabled', props);
        case PropKey.OPERATION_ENABLED:
          return  controller.run('isOperationEnabled',props);
        case PropKey.TOPIC_TITLE:
          return controller.run('getTopicTitle', props);
        case PropKey.DRAG_DROP_STATE:
          return diagramState.dragDrop as DragDropState;
        case PropKey.RIGHT_TOP_PANEL_STATE:
          return diagramState.rightTopPanel as RightTopPanelState;
      }
      return next();
    }
  };
}
