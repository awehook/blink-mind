import * as React from 'react';
import { PropKey } from '../../utils';
import { iconClassName } from '../../utils';
import { BaseProps } from './base-widget';

interface ToolbarItemProps extends BaseProps {
  onClick?: (e) => void;
  disabled?: boolean;
  children?: any;
  iconName: string;
  label?: string;
}
export function ToolbarItem(props: ToolbarItemProps) {
  const { controller, children, onClick, iconName } = props;
  let { disabled } = props;
  disabled = disabled || !controller.getValue(PropKey.OPERATION_ENABLED, props);
  const handleClick = e => {
    if (!disabled && onClick) onClick(e);
  };
  const nProps = {
    disabled,
    onClick: handleClick,
    className: 'bm-toolbar-item'
  };

  return (
    <div {...nProps}>
      <div className={iconClassName(iconName)} />
      {children}
    </div>
  );
}
