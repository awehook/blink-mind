import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { SettingGroup, SettingItem } from './components';

export function ClearAllCustomStyle(props) {
  const { controller } = props;
  const handleClearAllCustomStyle = e => {
    controller.run('clearAllCustomStyle', props);
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
