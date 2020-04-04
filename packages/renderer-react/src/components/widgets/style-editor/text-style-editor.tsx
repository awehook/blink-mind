import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';
import {
  SettingGroup,
  SettingItemColorPicker,
  SettingItemInput,
  SettingItemInputProps,
  SettingItemNumericInput,
  SettingItemSelect as SettingItemSelectC,
  SettingRow,
  SettingTitle
} from '../../common';

import { MenuItem } from '@blueprintjs/core';
import { ContentStyleEditorProps } from './types';

const SettingItemSelect = props => (
  <SettingItemSelectC labelWidth={'80px'} {...props} />
);

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
  const fontF = contentStyle.fontFamily || getI18nText(props, I18nKey.DEFAULT);
  const fontFamilyProps = {
    filterable: true,
    title: getI18nText(props, I18nKey.FONT_FAMILY) + ':',
    text: <span style={{ fontFamily: fontF }}>{fontF}</span>,
    items: controller.run('getFontList', props),
    itemRenderer: item => {
      const text = <span style={{ fontFamily: item }}>{item}</span>;
      return (
        <MenuItem
          key={item}
          text={text}
          onClick={() => {
            setContentStyle({ fontFamily: item });
          }}
        />
      );
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
    onItemSelect: item => {
      setContentStyle({ fontFamily: item });
    }
  };
  const fontStyle = contentStyle.fontStyle || 'Normal';
  const fontStyleProps = {
    title: getI18nText(props, I18nKey.FONT_STYLE) + ':',
    text: fontStyle,
    items: ['Normal', 'Italic', 'Oblique'],
    itemRenderer: (v, { handleClick }) => {
      return <MenuItem key={v} text={v} onClick={handleClick} />;
    },
    onItemSelect: item => {
      setContentStyle({
        fontStyle: item
      });
    }
  };

  const fontWeight = contentStyle.fontWeight || '400';
  const fontWeightItemsMap = new Map([
    ['100', 'Thin'],
    ['200', 'ExtraLight'],
    ['300', 'Light'],
    ['400', 'Normal'],
    ['500', 'Medium'],
    ['600', 'DemiBold'],
    ['700', 'Bold'],
    ['800', 'UltraBold'],
    ['900', 'Heavy']
  ]);

  const fontWeightProps = {
    title: getI18nText(props, I18nKey.FONT_WEIGHT) + ':',
    text: fontWeightItemsMap.get(fontWeight),
    items: Array.from(fontWeightItemsMap.keys()),
    itemRenderer: (v, { handleClick }) => {
      return (
        <MenuItem
          key={v}
          text={fontWeightItemsMap.get(v)}
          onClick={handleClick}
        />
      );
    },
    onItemSelect: item => {
      setContentStyle({
        fontWeight: item
      });
    }
  };

  const fontSizeNumInputProps = {
    title: `${getI18nText(props, I18nKey.FONT_SIZE)}:`,
    labelWidth: '80px',
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
      width: '50px'
    },
    labelWidth: '80px',
    value: contentStyle.lineHeight || '',
    onChange: handleLineHeightChange
  };
  return (
    <SettingGroup>
      <SettingTitle>{getI18nText(props, I18nKey.TEXT_EDITOR)}</SettingTitle>
      <SettingRow>
        <SettingItemSelect {...fontFamilyProps} />
        <SettingItemNumericInput {...fontSizeNumInputProps} />
      </SettingRow>
      <SettingRow>
        <SettingItemSelect {...fontWeightProps} />
        <SettingItemSelect {...fontStyleProps} />
      </SettingRow>
      <SettingRow>
        <SettingItemInput {...lineHeightInputProps} />
        <SettingItemColorPicker
          color={contentStyle.color}
          handleColorChange={handleColorChange}
        />
      </SettingRow>
    </SettingGroup>
  );
}
