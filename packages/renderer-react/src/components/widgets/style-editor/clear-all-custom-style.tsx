import { OpType } from '@blink-mind/core';
import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { SettingGroup, SettingItem } from '../../common';

export function ClearAllCustomStyle(props) {
  const { controller } = props;
  const handleClearAllCustomStyle = e => {
    controller.run('operation', {
      ...props,
      opType: OpType.CLEAR_ALL_CUSTOM_STYLE
    });
  };

  return (
    <SettingGroup>
      <SettingItem>
        <Button onClick={handleClearAllCustomStyle}>
          Clear All Custom Styles
        </Button>
      </SettingItem>
    </SettingGroup>
  );
}
