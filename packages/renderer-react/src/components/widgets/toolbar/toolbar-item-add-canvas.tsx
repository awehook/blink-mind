import { OpType } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';

export function ToolbarItemAddCanvas(props) {
  const { controller } = props;
  const onClick = () => {
    const model = controller.run('createNewCanvasModel', props);
    controller.run('operation', {
      ...props,
      opType: OpType.ADD_CANVAS,
      model
    });
  };
  return (
    <MenuItem text={getI18nText(props, I18nKey.ADD_CANVAS)} onClick={onClick} />
  );
}
