import { InputGroup, NumericInput, Popover } from '@blueprintjs/core';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { Flex, Margin } from '../../../../components/common';
import { iconClassName, IconName } from '../../../../utils';
import {
  ColorBar,
  SettingGroup,
  SettingItem,
  SettingTitle,
  WithBorder
} from './components';

export function TextStyleEditor(props) {
  const { topicStyle, setStyle } = props;
  const handleFontSizeChange = value => {
    // log('handleFontSizeChange:', value);
    setStyle({ fontSize: value });
  };

  const handleLineHeightChange = e => {
    // log('handleLineHeightChange:', e.target.value);
    setStyle({ lineHeight: e.target.value });
  };

  const handleColorChange = color => {
    setStyle({ color: color.hex });
  };

  const fontSizeNumInputProps = {
    min: 12,
    max: 100,
    value: parseInt(topicStyle.fontSize),
    style: {
      width: 50
    },
    onValueChange: handleFontSizeChange
  };
  const lineHeightInputProps = {
    style: {
      width: 50
    },
    value: topicStyle.lineHeight || '',
    onChange: handleLineHeightChange
  };
  return (
    <SettingGroup>
      <SettingTitle>Text Editor</SettingTitle>
      <Flex>
        <SettingItem>
          <Flex alignItems="center">
            <Margin margin="0 5px 0 0">FontSize: </Margin>
            <NumericInput {...fontSizeNumInputProps} />
          </Flex>
        </SettingItem>
        <SettingItem>
          <Flex alignItems="center">
            <Margin margin="0 5px 0 0">LineHeight: </Margin>
            <InputGroup {...lineHeightInputProps} />
          </Flex>
        </SettingItem>
        <SettingItem>
          <Popover>
            <WithBorder>
              <div className={iconClassName(IconName.COLOR_PICKER)} />
              <ColorBar color={topicStyle.color} />
            </WithBorder>
            <div>
              <SketchPicker
                color={topicStyle.color}
                onChangeComplete={handleColorChange}
              />
            </div>
          </Popover>
        </SettingItem>
      </Flex>
    </SettingGroup>
  );
}
