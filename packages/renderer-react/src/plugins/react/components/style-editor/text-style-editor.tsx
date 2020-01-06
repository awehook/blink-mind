import { InputGroup } from '@blueprintjs/core';
import * as React from 'react';
import { Flex, Margin } from '../../../../components/common';
import {
  SettingGroup,
  SettingItem,
  SettingItemColorPicker,
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
  const lineHeightInputProps = {
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
        <SettingItem>
          <Flex alignItems="center">
            <Margin margin="0 5px 0 0">LineHeight: </Margin>
            <InputGroup {...lineHeightInputProps} />
          </Flex>
        </SettingItem>
        <SettingItemColorPicker
          color={contentStyle.color}
          handleColorChange={handleColorChange}
        />
      </Flex>
    </SettingGroup>
  );
}
