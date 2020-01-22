import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';
import {
  renderItem,
  renderItemI18n,
  SettingGroup,
  SettingItemColorPicker,
  SettingItemSelect,
  SettingRow,
  SettingTitle
} from '../../common';
import { ContentStyleEditorProps } from './types';

const borderWidthItems = [...Array(7).keys()];
const borderRadiusItems = [0, 5, 10, 15, 20, 25, 30, 35];
const borderStyleItems = ['none', 'solid', 'dotted', 'dashed', 'double'];

export function BorderStyleEditor(props: ContentStyleEditorProps) {
  const { contentStyle, setContentStyle } = props;
  const handleBorderWidthChange = value => {
    // log('handleBorderWithChange:', value);
    setContentStyle({ borderWidth: `${value}px` });
  };

  const handleBorderStyleChange = value => {
    setContentStyle({ borderStyle: value });
  };

  const handleBorderRadiusChange = value => {
    // log('handleBorderRadiusChange:', value);
    setContentStyle({ borderRadius: `${value}px` });
  };

  const handleBorderColorChange = color => {
    setContentStyle({ borderColor: color });
  };

  return (
    <SettingGroup>
      <SettingTitle>{getI18nText(props, I18nKey.BORDER)}</SettingTitle>
      <SettingRow>
        <SettingItemSelect
          text={`${getI18nText(props, I18nKey.WIDTH)}: ${
            contentStyle.borderWidth ? contentStyle.borderWidth : getI18nText(props,I18nKey.DEFAULT)
          }`}
          items={borderWidthItems}
          itemRenderer={renderItem('px')}
          onItemSelect={handleBorderWidthChange}
        />
        <SettingItemSelect
          text={`${getI18nText(props, I18nKey.STYLE)}: ${
            contentStyle.borderStyle
              ? getI18nText(props, contentStyle.borderStyle)
              : getI18nText(props, I18nKey.NONE)
          }`}
          items={borderStyleItems}
          itemRenderer={renderItemI18n(props)}
          onItemSelect={handleBorderStyleChange}
        />
        <SettingItemSelect
          text={`${getI18nText(props, I18nKey.RADIUS)}: ${
            contentStyle.borderRadius
          }`}
          items={borderRadiusItems}
          itemRenderer={renderItem('px')}
          onItemSelect={handleBorderRadiusChange}
        />
        <SettingItemColorPicker
          color={contentStyle.borderColor}
          handleColorChange={handleBorderColorChange}
        />
      </SettingRow>
    </SettingGroup>
  );
}
