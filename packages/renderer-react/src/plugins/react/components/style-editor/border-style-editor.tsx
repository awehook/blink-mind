import { Popover } from '@blueprintjs/core';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { iconClassName, IconName } from '../../../../utils';
import {
  ColorBar,
  PxSelect,
  renderItem,
  SettingGroup,
  SettingItem,
  SettingTitle,
  WithBorder
} from './components';

import { Button } from '@blueprintjs/core';

const borderWidthItems = [...Array(7).keys()];
const borderRadiusItems = [0, 5, 10, 15, 20, 25, 30, 35];
const borderStyleItems = ['none', 'solid', 'dotted', 'dashed', 'double'];

export function BorderStyleEditor(props) {
  const { topicStyle, setStyle } = props;
  const handleBorderWidthChange = value => {
    // log('handleBorderWithChange:', value);
    setStyle({ borderWidth: `${value}px` });
  };

  const handleBorderStyleChange = value => {
    setStyle({ borderStyle: value });
  };

  const handleBorderRadiusChange = value => {
    // log('handleBorderRadiusChange:', value);
    setStyle({ borderRadius: `${value}px` });
  };

  const handleBorderColorChange = color => {
    setStyle({ borderColor: color.hex });
  };

  return (
    <SettingGroup>
      <SettingTitle>Border</SettingTitle>
      <div>
        <SettingItem>
          <PxSelect
            items={borderWidthItems}
            itemRenderer={renderItem('px')}
            filterable={false}
            onItemSelect={handleBorderWidthChange}
          >
            <Button
              text={`width: ${
                topicStyle.borderWidth ? topicStyle.borderWidth : '0px'
              }`}
            />
          </PxSelect>
        </SettingItem>
        <SettingItem>
          <PxSelect
            items={borderStyleItems}
            itemRenderer={renderItem('')}
            filterable={false}
            onItemSelect={handleBorderStyleChange}
          >
            <Button
              text={`style: ${
                topicStyle.borderStyle ? topicStyle.borderStyle : 'none'
              }`}
            />
          </PxSelect>
        </SettingItem>
        <SettingItem>
          <PxSelect
            items={borderRadiusItems}
            itemRenderer={renderItem('px')}
            filterable={false}
            onItemSelect={handleBorderRadiusChange}
          >
            <Button text={`radius: ${topicStyle.borderRadius}`} />
          </PxSelect>
        </SettingItem>
        <SettingItem>
          <Popover>
            <WithBorder>
              <div className={iconClassName(IconName.COLOR_PICKER)} />
              <ColorBar color={topicStyle.borderColor} />
            </WithBorder>
            <div>
              <SketchPicker
                color={topicStyle.borderColor}
                onChangeComplete={handleBorderColorChange}
              />
            </div>
          </Popover>
        </SettingItem>
      </div>
    </SettingGroup>
  );
}
