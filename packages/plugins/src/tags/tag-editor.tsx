import { PanelTabRoot } from '@blink-mind/renderer-react';
import {
  SettingBoxContainer,
  SettingItem,
  SettingTitle
} from '@blink-mind/renderer-react';
import * as React from 'react';
export function TagEditor(props) {
  return (
    <PanelTabRoot>
      <SettingBoxContainer>
        <SettingTitle>Tags Manager</SettingTitle>
      </SettingBoxContainer>
      <SettingBoxContainer>
        <SettingTitle>Current Topic Tags</SettingTitle>
      </SettingBoxContainer>
    </PanelTabRoot>
  );
}
