import { LinkStyle } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { getI18nText, I18nKey } from '../../../utils';
import {
  BaseProps,
  borderWidthItems,
  Margin,
  renderItem,
  renderItemI18n,
  SettingGroup,
  SettingItemColorPicker,
  SettingItemSelect,
  SettingRow,
  SettingTitle
} from '../../common';

const lineTypes = ['curve', 'round', 'line'];

const renderLineTypeItem = (lineType, { handleClick, modifiers, query }) => {
  return <MenuItem text={`${lineType}`} key={lineType} onClick={handleClick} />;
};

export interface LinkStyleEditorProps extends BaseProps {
  showLinkStyle?: boolean;
  showSubLinkStyle?: boolean;
  linkStyle: LinkStyle;
  subLinkStyle: LinkStyle;
  setLinkStyle: (LinkStyle) => void;
  setSubLinkStyle: (LinkStyle) => void;
}

export function LinkStyleEditor(props: LinkStyleEditorProps) {
  const {
    showLinkStyle = true,
    showSubLinkStyle = true,
    linkStyle = {},
    subLinkStyle = {},
    setLinkStyle,
    setSubLinkStyle
  } = props;

  const handleLinkWidthChange = value => {
    setLinkStyle({ lineWidth: `${value}px` });
  };

  const handleLinkTypeChange = value => {
    setLinkStyle({ lineType: value });
  };

  const handleLinkColorChange = color => {
    setLinkStyle({ lineColor: color });
  };

  const handleSubLinkWidthChange = value => {
    setSubLinkStyle({ lineWidth: `${value}px` });
  };

  const handleSubLinkTypeChange = value => {
    setSubLinkStyle({ lineType: value });
  };

  const handleSubLinkColorChange = color => {
    setSubLinkStyle({ lineColor: color });
  };
  return (
    <SettingGroup>
      <SettingTitle>{getI18nText(props, I18nKey.LINK)}</SettingTitle>
      {showLinkStyle && (
        <SettingRow alignItems="center">
          <Margin margin="0 5px 0 0">
            {getI18nText(props, I18nKey.LINK_TO_PARENT) + ':'}{' '}
          </Margin>
          <SettingItemSelect
            text={`${getI18nText(props, I18nKey.WIDTH)}: ${
              linkStyle ? linkStyle.lineWidth : '0px'
            }`}
            items={borderWidthItems}
            itemRenderer={renderItem('px')}
            onItemSelect={handleLinkWidthChange}
          />
          <SettingItemSelect
            text={`${getI18nText(props, I18nKey.LINE_TYPE)}: ${getI18nText(
              props,
              linkStyle.lineType
            )}`}
            items={lineTypes}
            itemRenderer={renderItemI18n(props)}
            onItemSelect={handleLinkTypeChange}
          />
          <SettingItemColorPicker
            color={linkStyle.lineColor}
            handleColorChange={handleLinkColorChange}
          />
        </SettingRow>
      )}
      {showSubLinkStyle && (
        <SettingRow alignItems="center">
          <Margin margin="0 5px 0 0">
            {getI18nText(props, I18nKey.SUB_LINKS) + ': '}
          </Margin>
          <SettingItemSelect
            text={`${getI18nText(props, I18nKey.WIDTH)}: ${
              subLinkStyle ? subLinkStyle.lineWidth : '0px'
            }`}
            items={borderWidthItems}
            itemRenderer={renderItem('px')}
            onItemSelect={handleSubLinkWidthChange}
          />
          <SettingItemSelect
            text={`${getI18nText(props, I18nKey.LINE_TYPE)}: ${getI18nText(
              props,
              subLinkStyle.lineType
            )}`}
            items={lineTypes}
            itemRenderer={renderItemI18n(props)}
            onItemSelect={handleSubLinkTypeChange}
          />
          <SettingItemColorPicker
            color={subLinkStyle.lineColor}
            handleColorChange={handleSubLinkColorChange}
          />
        </SettingRow>
      )}
    </SettingGroup>
  );
}
