import cx from 'classnames';
import * as React from 'react';
import { PropKey } from '../../utils';
import { iconClassName } from '../../utils';
import { BaseProps } from './base-widget';

interface ToolbarItemProps extends BaseProps {
  onClick?: (e) => void;
  disabled?: boolean;
  children?: any;
  iconName: string;
  iconCxName?: string;
  className?: string;
  label?: string;
}
export function ToolbarItem(props: ToolbarItemProps) {
  const {
    controller,
    children,
    onClick,
    className,
    iconName,
    iconCxName
  } = props;
  let { disabled } = props;
  disabled = disabled || !controller.getValue(PropKey.OPERATION_ENABLED, props);
  const handleClick = e => {
    if (!disabled && onClick) onClick(e);
  };
  const nProps = {
    onClick: handleClick,
    className: cx(
      'bm-toolbar-item',
      { 'bm-toolbar-item-disabled': disabled },
      className
    )
  };

  return (
    <div {...nProps}>
      <div className={cx(iconClassName(iconName), iconCxName)} />
      {children}
    </div>
  );
}

interface ToolbarGroupItemProps {
  items: ToolbarItemProps[];
}

export function ToolbarGroupItem(props: ToolbarGroupItemProps) {
  const { items } = props;
  return (
    <div className="bm-toolbar-group">
      {items.map(item => {
        const iProps = {
          ...item
        };
        return <ToolbarItem {...iProps} />;
      })}
    </div>
  );
}
