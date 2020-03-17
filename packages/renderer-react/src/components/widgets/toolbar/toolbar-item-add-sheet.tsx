import { OpType } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';

export function ToolbarItemAddSheet(props) {
  const { controller } = props;
  const onClick = () => {
    const sheetModel = controller.run('createNewSheetModel', props);
    controller.run('operation', {
      ...props,
      opType: OpType.ADD_SHEET,
      sheetModel
    });
  };

  return (
    <MenuItem text={getI18nText(props, I18nKey.ADD_SHEET)} onClick={onClick} />
  );
}
