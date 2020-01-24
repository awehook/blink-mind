import { isThemeType, OpType, ThemeType, TopicStyle } from '@blink-mind/core';
import { Alert, Tab, Tabs } from '@blueprintjs/core';
import debug from 'debug';
import { cloneDeep, merge } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import {
  browserDownloadText,
  browserOpenFile,
  getI18nText,
  I18nKey
} from '../../../utils';
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
const log = debug('node:theme-editor');

let tabId = 'normal';

export function ThemeEditor(props: BaseProps) {
  const [alertThemeError, setAlertThemeError] = useState(false);
  const { model, controller } = props;

  // 注意这里一定要用cloneDeep
  const theme: ThemeType = cloneDeep(model.config.theme);

  const {
    rootTopic,
    primaryTopic,
    normalTopic
  } = controller.run('getThemeOfTopic', { ...props, isClone: true });

  const setTheme = theme => {
    controller.run('operation', {
      ...props,
      opType: OpType.SET_THEME,
      theme
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
    ...props,
    topicStyle: rootTopic,
    setTopicStyle: setRootTopicStyle
  };

  const rootTopicEditor = <TopicThemeEditor {...rootTopicEditorProps} />;

  const primaryTopicEditorProps: TopicThemeEditorProps = {
    ...props,
    topicStyle: primaryTopic,
    setTopicStyle: setPrimaryTopicStyle
  };

  const primaryTopicEditor = <TopicThemeEditor {...primaryTopicEditorProps} />;

  const normalTopicEditorProps: TopicThemeEditorProps = {
    ...props,
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
        <Tab
          id="normal"
          title={getI18nText(props, I18nKey.NORMAL_TOPIC)}
          panel={normalTopicEditor}
        />
        <Tab
          id="primary"
          title={getI18nText(props, I18nKey.PRIMARY_TOPIC)}
          panel={primaryTopicEditor}
        />
        <Tab
          id="root"
          title={getI18nText(props, I18nKey.ROOT_TOPIC)}
          panel={rootTopicEditor}
        />
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
        <SettingTitle>{getI18nText(props, I18nKey.GLOBAL)}</SettingTitle>
        <SettingRow>
          <SettingLabel>
            {getI18nText(props, I18nKey.BACKGROUND) + ':'}
          </SettingLabel>
          <SettingItemColorPicker
            color={theme.background}
            handleColorChange={handleBackgroundColorChange}
          />
          <SettingLabel>
            {getI18nText(props, I18nKey.HIGHLIGHT) + ':'}
          </SettingLabel>
          <SettingItemColorPicker
            color={theme.highlightColor}
            handleColorChange={handleHighlightColorChange}
          />
          <SettingLabel>
            {getI18nText(props, I18nKey.RANDOM_COLOR) + ':'}
          </SettingLabel>
          <StyledCheckbox
            checked={theme.randomColor}
            onChange={handleRandomColorChange}
          />
        </SettingRow>
      </SettingGroup>
      {topicThemes}

      <SettingGroup>
        <SettingItemButton
          title={getI18nText(props, I18nKey.EXPORT_THEME)}
          onClick={handleExportTheme}
        />
        <SettingItemButton
          title={getI18nText(props, I18nKey.IMPORT_THEME)}
          onClick={handleImportTheme}
        />
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
