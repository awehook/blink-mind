import { LinkStyle } from '@blink-mind/core';
import { Button, MenuItem, Popover } from '@blueprintjs/core';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { Margin } from '../../../../components/common';
import { iconClassName, IconName } from '../../../../utils';
import {
  borderWidthItems,
  ColorBar,
  PxSelect,
  renderItem,
  SettingGroup,
  SettingItem,
  SettingRow,
  SettingTitle,
  WithBorder
} from './components';

const lineTypes = ['curve', 'round', 'line'];

const renderLineTypeItem = (lineType, { handleClick, modifiers, query }) => {
  return <MenuItem text={`${lineType}`} key={lineType} onClick={handleClick} />;
};

export function LinkStyleEditor(props) {
  const { controller } = props;
  const linkStyle: LinkStyle = controller.run('getLinkStyle', props);
  const subLinkStyle: LinkStyle = controller.run('getSubLinkStyle', props);

  const handleLinkWidthChange = value => {
    controller.run('setLinkStyle', {
      ...props,
      linkStyle: { lineWidth: `${value}px` }
    });
  };

  const handleLinkTypeChange = value => {
    controller.run('setLinkStyle', {
      ...props,
      linkStyle: { lineType: value }
    });
  };

  const handleSubLinkWidthChange = value => {
    controller.run('setSubLinkStyle', {
      ...props,
      subLinkStyle: { lineWidth: `${value}px` }
    });
  };

  const handleSubLinkTypeChange = value => {
    controller.run('setSubLinkStyle', {
      ...props,
      subLinkStyle: { lineType: value }
    });
  };

  const handleLinkColorChange = color => {
    controller.run('setLinkStyle', {
      ...props,
      linkStyle: { lineColor: color.hex }
    });
  };

  const handleSubLinkColorChange = color => {
    controller.run('setSubLinkStyle', {
      ...props,
      subLinkStyle: { lineColor: color.hex }
    });
  };

  return (
    <SettingGroup>
      <SettingTitle>Link</SettingTitle>
      <SettingRow alignItems="center">
        <Margin margin="0 5px 0 0">LinkToParent: </Margin>
        <SettingItem>
          <PxSelect
            items={borderWidthItems}
            itemRenderer={renderItem('')}
            filterable={false}
            onItemSelect={handleLinkWidthChange}
          >
            <Button
              text={`width: ${linkStyle ? linkStyle.lineWidth : '0px'}`}
            />
          </PxSelect>
        </SettingItem>
        <SettingItem>
          <PxSelect
            items={lineTypes}
            itemRenderer={renderLineTypeItem}
            filterable={false}
            onItemSelect={handleLinkTypeChange}
          >
            <Button text={`lineType: ${linkStyle.lineType}`} />
          </PxSelect>
        </SettingItem>
        <SettingItem>
          <Popover>
            <WithBorder>
              <div className={iconClassName(IconName.COLOR_PICKER)} />
              <ColorBar color={linkStyle.lineColor} />
            </WithBorder>
            <div>
              <SketchPicker
                color={linkStyle.lineColor}
                onChangeComplete={handleLinkColorChange}
              />
            </div>
          </Popover>
        </SettingItem>
      </SettingRow>
      <SettingRow alignItems="center">
        <Margin margin="0 5px 0 0">SubLinks: </Margin>
        <SettingItem>
          <PxSelect
            items={borderWidthItems}
            itemRenderer={renderItem('')}
            filterable={false}
            onItemSelect={handleSubLinkWidthChange}
          >
            <Button
              text={`width: ${subLinkStyle ? subLinkStyle.lineWidth : '0px'}`}
            />
          </PxSelect>
        </SettingItem>
        <SettingItem>
          <PxSelect
            items={lineTypes}
            itemRenderer={renderLineTypeItem}
            filterable={false}
            onItemSelect={handleSubLinkTypeChange}
          >
            <Button text={`lineType: ${subLinkStyle.lineType}`} />
          </PxSelect>
        </SettingItem>
        <SettingItem>
          <Popover>
            <WithBorder>
              <div className={iconClassName(IconName.COLOR_PICKER)} />
              <ColorBar color={subLinkStyle.lineColor} />
            </WithBorder>
            <div>
              <SketchPicker
                color={subLinkStyle.lineColor}
                onChangeComplete={handleSubLinkColorChange}
              />
            </div>
          </Popover>
        </SettingItem>
      </SettingRow>
    </SettingGroup>
  );
}
