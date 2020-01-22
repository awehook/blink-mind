import {
  getI18nText,
  I18nKey,
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
        <SettingTitle>{getI18nText(props, I18nKey.TAGS_MANAGER)}</SettingTitle>
        <AddTagWidget {...props} />
        <AllTagsWidget {...props} />
      </SettingBoxContainer>
      <SettingBoxContainer>
        <TopicTagsWidget {...props} />
      </SettingBoxContainer>
    </PanelTabRoot>
  );
}
