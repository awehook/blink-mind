import * as React from 'react';
import styled from 'styled-components';
import { PropKey } from '../../utils';
import { BaseProps } from './base-widget';
export const ToolbarItemRoot = styled.div`
  position: relative;
  padding: 6px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: ${props => (props.disabled ? 'grey' : 'black')};
  font-size: 24px;
  display: inline-block;
  &:hover {
    color: ${props => (props.disabled ? 'grey' : 'rgb(44, 184, 146)')};
  }
`;
interface ToolbarItemProps extends BaseProps {
  onClick?: (e) => void;
  disabled?: boolean;
  children?: any;
}
export function ToolbarItem(props: ToolbarItemProps) {
  const { controller, children, onClick, ...restProps } = props;
  let { disabled } = props;
  disabled = disabled || !controller.getValue(PropKey.OPERATION_ENABLED,props);
  const handleClick = e => {
    if (!disabled) onClick(e);
  };
  const nProps = {
    controller,
    disabled,
    onClick: handleClick,
    ...restProps
  };
  return <ToolbarItemRoot {...nProps}>{children}</ToolbarItemRoot>;
}
