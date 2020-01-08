import { InputGroup } from '@blueprintjs/core';
import * as React from 'react';
import { Flex, Margin } from '../../common';
import {
  SettingGroup,
  SettingItem,
  SettingItemColorPicker,
  SettingItemInput,
  SettingItemInputProps,
  SettingItemNumericInput,
  SettingTitle
} from '../right-top-panel';
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
    title: 'FontSize:',
    min: 12,
    max: 100,
    value: parseInt(contentStyle.fontSize),
    style: {
      width: 50
    },
    onValueChange: handleFontSizeChange
  };
  const lineHeightInputProps: SettingItemInputProps = {
    title: 'LineHeight:',
    style: {
      width: 50
    },
    value: contentStyle.lineHeight || '',
    onChange: handleLineHeightChange
  };
  return (
    <SettingGroup>
      <SettingTitle>Text Editor</SettingTitle>
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
