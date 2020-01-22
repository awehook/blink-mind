import { LinkStyle, OpType, TopicContentStyle } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';
import {
  BaseProps,
  PanelTabRoot,
  SettingGroup,
  SettingItemButton,
  SettingItemColorPicker,
  SettingTitle
} from '../../common';

import { BorderStyleEditor } from './border-style-editor';
import { ClearAllCustomStyle } from './clear-all-custom-style';
import { LinkStyleEditor, LinkStyleEditorProps } from './link-style-editor';
import { TextStyleEditor } from './text-style-editor';
import { ContentStyleEditorProps } from './types';

const log = debug('node:style-editor');

let copiedStyle;

export function StyleEditor(props: BaseProps) {
  const { controller, model, topicKey } = props;
  const topic = model.getTopic(topicKey);
  const setContentStyle = style => {
    controller.run('setTopicContentStyle', { ...props, style });
  };

  const handleBackgroundColorChange = color => {
    setContentStyle({ background: color });
  };

  const handleClearStyle = () => {
    if (topic.style) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_STYLE,
        style: null
      });
    }
  };

  const handleCopyStyle = () => {
    copiedStyle = controller.run('getTopicStyle', props);
    log(copiedStyle);
  };

  const handlePasteStyle = () => {
    if (copiedStyle) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_STYLE,
        style: JSON.stringify(copiedStyle)
      });
    }
  };

  if (!model.focusKey) return null;
  const contentStyle: TopicContentStyle = controller.run(
    'getTopicContentStyle',
    props
  );

  const linkStyle: LinkStyle = controller.run('getLinkStyle', props);
  const subLinkStyle: LinkStyle = controller.run('getSubLinkStyle', props);
  const setLinkStyle = linkStyle => {
    controller.run('setLinkStyle', {
      ...props,
      linkStyle
    });
  };

  const setSubLinkStyle = subLinkStyle => {
    controller.run('setSubLinkStyle', {
      ...props,
      subLinkStyle
    });
  };

  const linkStyleEditorProps: LinkStyleEditorProps = {
    ...props,
    linkStyle,
    subLinkStyle,
    setLinkStyle,
    setSubLinkStyle
  };

  const contentStyleEditorPros: ContentStyleEditorProps = {
    ...props,
    contentStyle,
    setContentStyle
  };

  return (
    <PanelTabRoot>
      <BorderStyleEditor {...contentStyleEditorPros} />
      <TextStyleEditor {...contentStyleEditorPros} />
      <SettingGroup>
        <SettingTitle>{getI18nText(props, I18nKey.BACKGROUND)}</SettingTitle>
        <SettingItemColorPicker
          color={contentStyle.background}
          handleColorChange={handleBackgroundColorChange}
        />
      </SettingGroup>
      <LinkStyleEditor {...linkStyleEditorProps} />
      <SettingGroup>
        <SettingItemButton
          title={getI18nText(props, I18nKey.CLEAR_TOPIC_STYLE)}
          onClick={handleClearStyle}
        />
        <SettingItemButton
          title={getI18nText(props, I18nKey.COPY_STYLE)}
          onClick={handleCopyStyle}
        />
        <SettingItemButton
          title={getI18nText(props, I18nKey.PASTE_STYLE)}
          onClick={handlePasteStyle}
        />
      </SettingGroup>
      {ClearAllCustomStyle(props)}
    </PanelTabRoot>
  );
}
