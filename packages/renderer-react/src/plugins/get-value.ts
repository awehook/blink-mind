import { PropKey } from '../utils';

export function GetValuePlugin() {
  return {
    getValue(props, next) {
      const { propKey, controller } = props;
      switch (propKey) {
        case PropKey.DIAGRAM_CUSTOMIZE_BASE_Z_INDEX:
          return 3;
        case PropKey.TOPIC_CONTEXT_MENU_ENABLED:
          return controller.run('isOperationEnabled', props);
        case PropKey.TOPIC_TITLE:
          return controller.run('getTopicTitle', props);
      }
      return next();
    }
  };
}
