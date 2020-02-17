import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';
import {
  renderItem,
  renderItemI18n,
  SettingGroup,
  SettingItemColorPicker,
  SettingItemSelect as SettingItemSelectC,
  SettingRow,
  SettingTitle
} from '../../common';
import { ContentStyleEditorProps } from './types';

const SettingItemSelect = props => (
  <SettingItemSelectC labelWidth={'45px'} {...props} />
);

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
  const labelWidth = 50;
  return (
    <SettingGroup>
      <SettingTitle>{getI18nText(props, I18nKey.BORDER)}</SettingTitle>
      <SettingRow>
        <SettingItemSelect
          title={`${getI18nText(props, I18nKey.WIDTH)}:`}
          text={
            contentStyle.borderWidth
              ? contentStyle.borderWidth
              : getI18nText(props, I18nKey.DEFAULT)
          }
          items={borderWidthItems}
          itemRenderer={renderItem('px')}
          onItemSelect={handleBorderWidthChange}
        />
        <SettingItemSelect
          title={`${getI18nText(props, I18nKey.STYLE)}:`}
          text={
            contentStyle.borderStyle
              ? getI18nText(props, contentStyle.borderStyle)
              : getI18nText(props, I18nKey.NONE)
          }
          items={borderStyleItems}
          itemRenderer={renderItemI18n(props)}
          onItemSelect={handleBorderStyleChange}
        />
        <SettingItemSelect
          title={`${getI18nText(props, I18nKey.RADIUS)}:`}
          text={contentStyle.borderRadius}
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
