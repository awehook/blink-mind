import { OpType } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { getI18nText, I18nKey, RefKey } from '../../../utils';

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
  const onClick2 = () => {
    const { getRef, model } = props;
    const canvasRoot = getRef(RefKey.CANVAS_ROOT_KEY + model.id);
    if (canvasRoot.style.display !== 'block') {
      canvasRoot.style.display = 'block';
    } else {
      canvasRoot.style.display = 'none';
    }

    // if (canvasRoot.style.visibility !== 'hidden') {
    //   canvasRoot.style.visibility = 'hidden';
    // } else {
    //   canvasRoot.style.visibility = 'visible';
    // }
    // console.log(canvasRoot.style.visibility);
  };
  return (
    <MenuItem
      text={getI18nText(props, I18nKey.ADD_CANVAS)}
      onClick={onClick}
      // onClick={onClick2}
    />
  );
}
