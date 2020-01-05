import { iconClassName, IconName } from '@blink-mind/renderer-react';
import { Button, Divider, MenuItem, Popover } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { ItemRenderer } from '@blueprintjs/select/src/common/itemRenderer';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { ColorBar, SettingItem, WithBorder } from './styled';
export function SettingGroup(props) {
  return (
    <div>
      {props.children}
      <Divider style={{ margin: '10px 0' }} />
    </div>
  );
}

export function SettingItemColorPicker(props: {
  color: string;
  handleColorChange: (color: string) => void;
}) {
  const { color, handleColorChange } = props;
  return (
    <SettingItem>
      <Popover>
        <WithBorder>
          <div className={iconClassName(IconName.COLOR_PICKER)} />
          <ColorBar color={color} />
        </WithBorder>
        <div>
          <SketchPicker
            color={color}
            onChangeComplete={color => handleColorChange(color.hex)}
          />
        </div>
      </Popover>
    </SettingItem>
  );
}

export function SettingItemButton(props: {
  title: string;
  handleClick: (e) => void;
}) {
  const { title, handleClick } = props;
  return (
    <SettingItem>
      <Button onClick={handleClick}>{title}</Button>
    </SettingItem>
  );
}

export function SettingItemSelect<T>(props: {
  text: string;
  items: T[];
  itemRenderer: ItemRenderer<T>;
  onItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;
}) {
  const { text, items, itemRenderer, onItemSelect } = props;
  const PxSelect = Select.ofType<T>();
  const pxProps = {
    items,
    itemRenderer,
    onItemSelect,
    filterable: false
  };
  return (
    <SettingItem>
      <PxSelect {...pxProps}>
        <Button text={text} />
      </PxSelect>
    </SettingItem>
  );
}

export const renderItem = unit => (width, { handleClick }) => {
  return (
    <MenuItem text={`${width}${unit}`} key={width} onClick={handleClick} />
  );
};

export const PxSelect = Select.ofType();

export const borderWidthItems = [...Array(7).keys()];
