import { isThemeType, OpType, ThemeType, TopicStyle } from '@blink-mind/core';
import { Alert, Tab, Tabs } from '@blueprintjs/core';
import { clone, merge } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { browserDownloadText, browserOpenFile } from '../../../utils';
import { handleBooleanChange } from '../../../utils/blueprint';
import {
  BaseProps,
  PanelTabRoot,
  SettingBoxContainer,
  SettingGroup,
  SettingItemButton,
  SettingItemColorPicker,
  SettingLabel,
  SettingRow,
  SettingTitle,
  StyledCheckbox
} from '../../common';
import { TopicThemeEditor, TopicThemeEditorProps } from './topic-theme-editor';

let tabId = 'normal';

export function ThemeEditor(props: BaseProps) {
  const [alertThemeError, setAlertThemeError] = useState(false);
  const { model, controller } = props;
  const theme: ThemeType = model.config.theme;

  const { rootTopic, primaryTopic, normalTopic } = controller.run(
    'getThemeOfTopic',
    props
  );

  const setTheme = theme => {
    controller.run('operation', {
      ...props,
      opType: OpType.SET_THEME,
      theme: clone(theme)
    });
  };

  const handleBackgroundColorChange = background => {
    setTheme(merge(theme, { background }));
  };

  const handleHighlightColorChange = highlightColor => {
    setTheme(merge(theme, { highlightColor }));
  };

  const handleRandomColorChange = handleBooleanChange(randomColor => {
    setTheme(merge(theme, { randomColor }));
  });

  const setRootTopicStyle = (style: TopicStyle) => {
    setTheme(merge(theme, { rootTopic: style }));
  };

  const setPrimaryTopicStyle = (style: TopicStyle) => {
    setTheme(merge(theme, { primaryTopic: style }));
  };

  const setNormalTopicStyle = (style: TopicStyle) => {
    setTheme(merge(theme, { normalTopic: style }));
  };

  const rootTopicEditorProps: TopicThemeEditorProps = {
    topicStyle: rootTopic,
    setTopicStyle: setRootTopicStyle
  };

  const rootTopicEditor = <TopicThemeEditor {...rootTopicEditorProps} />;

  const primaryTopicEditorProps: TopicThemeEditorProps = {
    topicStyle: primaryTopic,
    setTopicStyle: setPrimaryTopicStyle
  };

  const primaryTopicEditor = <TopicThemeEditor {...primaryTopicEditorProps} />;

  const normalTopicEditorProps: TopicThemeEditorProps = {
    topicStyle: normalTopic,
    setTopicStyle: setNormalTopicStyle
  };

  const normalTopicEditor = <TopicThemeEditor {...normalTopicEditorProps} />;

  const tabsProps = {
    id: tabId,
    handleTabIdChange: id => {
      tabId = id;
    }
  };

  const topicThemes = (
    <SettingBoxContainer>
      <Tabs {...tabsProps}>
        <Tab id="normal" title="NormalTopic" panel={normalTopicEditor} />
        <Tab id="primary" title="PrimaryTopic" panel={primaryTopicEditor} />
        <Tab id="root" title="RootTopic" panel={rootTopicEditor} />
      </Tabs>
    </SettingBoxContainer>
  );

  const handleExportTheme = e => {
    // setShowExportDialog(true);
    const text = JSON.stringify(theme);
    browserDownloadText(text, 'blink-mind-theme.json');
  };
  const handleImportTheme = e => {
    browserOpenFile('.json,.txt').then(txt => {
      const t: ThemeType = JSON.parse(txt);
      if (!isThemeType(t)) {
        setAlertThemeError(true);
        return;
      }
      setTheme(t);
    });
  };
  const alertProps = {
    isOpen: alertThemeError,
    onClose: e => {
      setAlertThemeError(false);
    }
  };
  const alert = (
    <Alert {...alertProps}>
      <p>File format error</p>
    </Alert>
  );

  return (
    <PanelTabRoot>
      <SettingGroup>
        <SettingTitle>Global</SettingTitle>
        <SettingRow>
          <SettingLabel>Background:</SettingLabel>
          <SettingItemColorPicker
            color={theme.background}
            handleColorChange={handleBackgroundColorChange}
          />
          <SettingLabel>Highlight:</SettingLabel>
          <SettingItemColorPicker
            color={theme.highlightColor}
            handleColorChange={handleHighlightColorChange}
          />
          <SettingLabel>Random Color:</SettingLabel>
          <StyledCheckbox
            checked={theme.randomColor}
            onChange={handleRandomColorChange}
          />
        </SettingRow>
      </SettingGroup>
      {topicThemes}

      <SettingGroup>
        <SettingItemButton title="Export Theme" onClick={handleExportTheme} />
        <SettingItemButton title="Import Theme" onClick={handleImportTheme} />
      </SettingGroup>

      {/*<Dialog*/}
      {/*  onClose={()=>setShowExportDialog(false)}*/}
      {/*  isOpen={showExportDialog}*/}
      {/*  autoFocus*/}
      {/*  enforceFocus*/}
      {/*  usePortal*/}
      {/*  title="Please input the export file name"*/}
      {/*>*/}
      {/*  */}
      {/*</Dialog>*/}
      {alert}
    </PanelTabRoot>
  );
}
