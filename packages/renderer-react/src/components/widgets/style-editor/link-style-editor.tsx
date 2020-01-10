import { LinkStyle } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import {
  borderWidthItems,
  Margin,
  renderItem,
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

export interface LinkStyleEditorProps {
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
      <SettingTitle>Link</SettingTitle>
      {showLinkStyle && (
        <SettingRow alignItems="center">
          <Margin margin="0 5px 0 0">LinkToParent: </Margin>
          <SettingItemSelect
            text={`width: ${linkStyle ? linkStyle.lineWidth : '0px'}`}
            items={borderWidthItems}
            itemRenderer={renderItem('px')}
            onItemSelect={handleLinkWidthChange}
          />
          <SettingItemSelect
            text={`lineType: ${linkStyle.lineType}`}
            items={lineTypes}
            itemRenderer={renderLineTypeItem}
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
          <Margin margin="0 5px 0 0">SubLinks: </Margin>
          <SettingItemSelect
            text={`width: ${subLinkStyle ? subLinkStyle.lineWidth : '0px'}`}
            items={borderWidthItems}
            itemRenderer={renderItem('px')}
            onItemSelect={handleSubLinkWidthChange}
          />
          <SettingItemSelect
            text={`lineType: ${subLinkStyle.lineType}`}
            items={lineTypes}
            itemRenderer={renderLineTypeItem}
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
