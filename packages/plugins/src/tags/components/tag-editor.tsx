import {
  PanelTabRoot,
  SettingBoxContainer,
  SettingTitle
} from '@blink-mind/renderer-react';
import * as React from 'react';
import { AddTagWidget } from './add-tag-widget';
import { AllTagsWidget } from './all-tags-widget';
import { TopicTagsWidget } from './topic-tags-widget';
export function TagEditor(props) {
  return (
    <PanelTabRoot>
      <SettingBoxContainer>
        <SettingTitle>Tags Manager</SettingTitle>
        <AddTagWidget {...props} />
        <AllTagsWidget {...props} />
      </SettingBoxContainer>
      <SettingBoxContainer>
        <TopicTagsWidget {...props} />
      </SettingBoxContainer>
    </PanelTabRoot>
  );
}
