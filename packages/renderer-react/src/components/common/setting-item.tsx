import {
  Button,
  Divider,
  InputGroup,
  MenuItem,
  NumericInput,
  Popover
} from '@blueprintjs/core';
import { ItemPredicate, Select } from '@blueprintjs/select';
import { ItemRenderer } from '@blueprintjs/select/src/common/itemRenderer';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import { getI18nText, iconClassName, IconName } from '../../utils';
import { Flex } from './styled';
import { ColorBar, SettingItem, WithBorder } from './styled-setting';
const Label = styled.div`
  margin: ${props => (props.width == null ? '0 5px 0 0' : null)};
  width: ${props => props.width};
`;

export function SettingGroup(props) {
  return <div className="bm-setting-group bp3-divider">{props.children}</div>;
}

export function SettingItemFlex(props) {
  const { layout = 'h', children } = props;
  const flexProps = {
    flexDirection: layout === 'h' ? 'row' : 'column',
    alignItems: 'center'
  };
  return (
    <SettingItem>
      <Flex {...flexProps}>{children}</Flex>
    </SettingItem>
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
  return (
    <SettingItemFlex layout={layout}>
      {title != null && <Label>{title}</Label>}
      <Popover>
        <WithBorder>
          <div className={iconClassName(IconName.COLOR_PICKER)} />
          <ColorBar color={color} />
        </WithBorder>
        <div>
          <SketchPicker
            color={color}
            onChangeComplete={color => {
              const { r, g, b, a } = color.rgb;
              handleColorChange(`rgba(${r},${g},${b},${a})`);
            }}
          />
        </div>
      </Popover>
    </SettingItemFlex>
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
  labelWidth?: string;
  value: number;
  min: number;
  max: number;
  onValueChange: (valueAsNumber: number, valueAsString: string) => void;
}

export function SettingItemNumericInput(props: SettingItemNumericInputProps) {
  const { layout = 'h', labelWidth, title, ...restProps } = props;
  return (
    <SettingItemFlex layout={layout}>
      <Label width={labelWidth}>{title}</Label>
      <NumericInput {...restProps} />
    </SettingItemFlex>
  );
}

export interface SettingItemInputProps {
  layout?: string;
  title: string;
  labelWidth?: string;
  style?: Object;
  value: string;
  onChange: React.FormEventHandler<HTMLElement>;
}

export function SettingItemInput(props) {
  const { layout = 'h', labelWidth, title, ...restProps } = props;
  return (
    <SettingItemFlex layout={layout}>
      <Label width={labelWidth}>{title} </Label>
      <InputGroup {...restProps} />
    </SettingItemFlex>
  );
}

export function SettingItemSelect<T>(props: {
  layout?: string;
  filterable?: boolean;
  title?: string;
  labelWidth?: string;
  text: string | React.ReactElement;
  items: T[];
  itemRenderer: ItemRenderer<T>;
  itemPredicate?: ItemPredicate<T>;
  onItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;
}) {
  const {
    layout = 'h',
    filterable = false,
    title,
    labelWidth,
    text,
    ...rest
  } = props;
  const PxSelect = Select.ofType<T>();
  const pxProps = {
    filterable,
    ...rest
  };
  return (
    <SettingItemFlex layout={layout}>
      {title && <Label width={labelWidth}>{title}</Label>}
      <PxSelect {...pxProps}>
        <Button text={text} />
      </PxSelect>
    </SettingItemFlex>
  );
}

export const renderItem = unit => (v, { handleClick }) => {
  return <MenuItem text={`${v}${unit}`} key={v} onClick={handleClick} />;
};

export const renderItemI18n = ctx => (v, { handleClick }) => {
  return <MenuItem text={getI18nText(ctx, v)} key={v} onClick={handleClick} />;
};

export const PxSelect = Select.ofType();

export const borderWidthItems = [...Array(7).keys()];
