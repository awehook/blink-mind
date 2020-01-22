import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';
import {
  Flex,
  SettingGroup,
  SettingItemColorPicker,
  SettingItemInput,
  SettingItemInputProps,
  SettingItemNumericInput,
  SettingTitle
} from '../../common';

import { ContentStyleEditorProps } from './types';

export function TextStyleEditor(props: ContentStyleEditorProps) {
  const { contentStyle, setContentStyle } = props;
  const handleFontSizeChange = value => {
    // log('handleFontSizeChange:', value);
    setContentStyle({ fontSize: value });
  };

  const handleLineHeightChange = e => {
    // log('handleLineHeightChange:', e.target.value);
    setContentStyle({ lineHeight: e.target.value });
  };

  const handleColorChange = color => {
    setContentStyle({ color });
  };

  const fontSizeNumInputProps = {
    title: `${getI18nText(props, I18nKey.FONT_SIZE)}:`,
    min: 12,
    max: 100,
    value: parseInt(contentStyle.fontSize),
    style: {
      width: 50
    },
    onValueChange: handleFontSizeChange
  };
  const lineHeightInputProps: SettingItemInputProps = {
    title: `${getI18nText(props, I18nKey.LINE_HEIGHT)}:`,
    style: {
      width: 50
    },
    value: contentStyle.lineHeight || '',
    onChange: handleLineHeightChange
  };
  return (
    <SettingGroup>
      <SettingTitle>{getI18nText(props, I18nKey.TEXT_EDITOR)}</SettingTitle>
      <Flex>
        <SettingItemNumericInput {...fontSizeNumInputProps} />
        <SettingItemInput {...lineHeightInputProps} />
        <SettingItemColorPicker
          color={contentStyle.color}
          handleColorChange={handleColorChange}
        />
      </Flex>
    </SettingGroup>
  );
}
