import {
  Button,
  Divider,
  InputGroup,
  MenuItem,
  NumericInput,
  Popover
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { ItemRenderer } from '@blueprintjs/select/src/common/itemRenderer';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { iconClassName, IconName } from '../../utils';
import { Flex, Margin } from './styled';
import { ColorBar, SettingItem, WithBorder } from './styled-setting';
export function SettingGroup(props) {
  return (
    <div>
      {props.children}
      <Divider style={{ margin: '10px 0' }} />
    </div>
  );
}

export interface SettingItemColorPickerProps {
  title?: string;
  layout?: string;
  color: string;
  handleColorChange: (color: string) => void;
}

export function SettingItemColorPicker(props: SettingItemColorPickerProps) {
  const { title, layout = 'h', color, handleColorChange } = props;
  const flexProps = {
    flexDirection: layout === 'h' ? 'row' : 'column',
    alignItems: 'center'
  };
  return (
    <SettingItem>
      <Flex {...flexProps}>
        {title != null && <Margin margin="0 5px 0 0">{title}</Margin>}
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
      </Flex>
    </SettingItem>
  );
}

export interface SettingItemButtonProps {
  title: string;
  onClick: (e) => void;
  disabled?: boolean;
}

export function SettingItemButton(props: SettingItemButtonProps) {
  const { title, ...restProps } = props;
  return (
    <SettingItem>
      <Button {...restProps}>{title}</Button>
    </SettingItem>
  );
}

export interface SettingItemNumericInputProps {
  layout?: string;
  title: string;
  value: number;
  min: number;
  max: number;
  onValueChange: (valueAsNumber: number, valueAsString: string) => void;
}

export function SettingItemNumericInput(props: SettingItemNumericInputProps) {
  const { layout = 'h', title, ...restProps } = props;
  const flexProps = {
    flexDirection: layout === 'h' ? 'row' : 'column',
    alignItems: 'center'
  };
  return (
    <SettingItem>
      <Flex {...flexProps}>
        <Margin margin="0 5px 0 0">{title}</Margin>
        <NumericInput {...restProps} />
      </Flex>
    </SettingItem>
  );
}

export interface SettingItemInputProps {
  layout?: string;
  title: string;
  style?: Object;
  value: string;
  onChange: React.FormEventHandler<HTMLElement>;
}

export function SettingItemInput(props) {
  const { layout = 'h', title, ...restProps } = props;
  const flexProps = {
    flexDirection: layout === 'h' ? 'row' : 'column',
    alignItems: 'center'
  };
  return (
    <SettingItem>
      <Flex {...flexProps}>
        <Margin margin="0 5px 0 0">{title} </Margin>
        <InputGroup {...restProps} />
      </Flex>
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
