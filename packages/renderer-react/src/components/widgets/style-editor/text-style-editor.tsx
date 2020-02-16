import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';
import {
  Flex,
  SettingGroup,
  SettingItemColorPicker,
  SettingItemInput,
  SettingItemInputProps,
  SettingItemNumericInput,
  SettingItemSelect,
  SettingTitle
} from '../../common';

import { ContentStyleEditorProps } from './types';
import { MenuItem } from '@blueprintjs/core';

export function TextStyleEditor(props: ContentStyleEditorProps) {
  const { controller, contentStyle, setContentStyle } = props;
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

  const fontFamilyProps = {
    filterable: true,
    title: getI18nText(props, I18nKey.FONT_FAMILY) + ':',
    text: '',
    items: controller.run('getFontList', props),
    itemRenderer: item => {
      const text = <span style={{ fontFamily: item }}>{item.replace(/^"|"$/g,'')}</span>;
      return <MenuItem key={item} text={text} />;
    },
    itemPredicate: (query, item, _index, exactMatch) => {
      const normalizedTitle = item.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return normalizedTitle.indexOf(normalizedQuery) >= 0;
      }
    },
    onItemSelect: item => {}
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
        <SettingItemSelect {...fontFamilyProps} />
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
