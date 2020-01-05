import { LinkStyle } from '@blink-mind/core';
import { MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { Margin } from '../../../../components/common';
import {
  borderWidthItems,
  renderItem,
  SettingGroup,
  SettingItemColorPicker,
  SettingItemSelect,
  SettingRow,
  SettingTitle
} from '../right-top-panel';

const lineTypes = ['curve', 'round', 'line'];

const renderLineTypeItem = (lineType, { handleClick, modifiers, query }) => {
  return <MenuItem text={`${lineType}`} key={lineType} onClick={handleClick} />;
};

export interface LinkStyleEditorProps {
  linkStyle: LinkStyle;
  subLinkStyle: LinkStyle;
  setLinkStyle: (LinkStyle) => void;
  setSubLinkStyle: (LinkStyle) => void;
}

export function LinkStyleEditor(props: LinkStyleEditorProps) {
  const {
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
    </SettingGroup>
  );
}
