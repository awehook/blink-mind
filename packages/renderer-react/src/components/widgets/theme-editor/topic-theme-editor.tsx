import { LinkStyle, TopicContentStyle, TopicStyle } from '@blink-mind/core';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nText, I18nKey } from '../../../utils';
import {
  BaseProps,
  SettingGroup,
  SettingItemColorPicker,
  SettingTitle
} from '../../common';
import { BorderStyleEditor } from '../style-editor/border-style-editor';
import { LinkStyleEditor } from '../style-editor/link-style-editor';
import { PaddingStyleEditor } from '../style-editor/padding-style-editor';
import { TextStyleEditor } from '../style-editor/text-style-editor';
import { ContentStyleEditorProps } from '../style-editor/types';

const TopicThemeEditorRoot = styled.div`
  height: 250px;
  overflow: auto;
`;

export interface TopicThemeEditorProps extends BaseProps {
  topicStyle: TopicStyle;
  setTopicStyle: (style: TopicStyle) => void;
}

export function TopicThemeEditor(props: TopicThemeEditorProps) {
  const { topicStyle, setTopicStyle } = props;
  const { contentStyle = {}, linkStyle = {}, subLinkStyle = {} } = topicStyle;

  const setContentStyle = (contentStyle: TopicContentStyle) => {
    setTopicStyle({ contentStyle });
  };

  const nProps: ContentStyleEditorProps = {
    ...props,
    contentStyle,
    setContentStyle
  };

  const setLinkStyle = (linkStyle: LinkStyle) => {
    setTopicStyle({ linkStyle });
  };

  const setSubLinkStyle = (subLinkStyle: LinkStyle) => {
    setTopicStyle({ subLinkStyle });
  };

  const linkStyleEditorProps = {
    ...props,
    showLinkStyle: false,
    linkStyle,
    subLinkStyle,
    setLinkStyle,
    setSubLinkStyle
  };
  return (
    <TopicThemeEditorRoot>
      <BorderStyleEditor {...nProps} />
      <PaddingStyleEditor {...nProps} />
      <TextStyleEditor {...nProps} />
      <SettingGroup>
        <SettingTitle>{getI18nText(props, I18nKey.BACKGROUND)}</SettingTitle>
        <SettingItemColorPicker
          color={contentStyle.background}
          handleColorChange={color => {
            setContentStyle({ background: color });
          }}
        />
      </SettingGroup>
      <LinkStyleEditor {...linkStyleEditorProps} />
    </TopicThemeEditorRoot>
  );
}
