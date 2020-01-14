import cx from 'classnames';
import * as React from 'react';
import styled from 'styled-components';
import { BaseProps, BaseWidget } from '../common';

export type TopicContextMenuItemConfig = {
  type: string;
  icon?: string;
  label?: string;
  opType?: string;
  rootCanUse?: boolean;
  hotKey?: string;
};

export const TopicPopupMenuItemType = {
  ITEM: 'ITEM',
  SEP_LINE: 'SEP_LINE'
};

interface Props extends BaseProps {
  config: TopicContextMenuItemConfig;
}

const MenuItem = styled.li`
  list-style: none;
  padding: 3px 12px;
  font-size: 14px;
  line-height: 18px;
  cursor: pointer;
  &:hover {
    background: darkgray;
  }
`;

const MenuItemLabel = styled.span`
  margin-left: 8px;
`;

export class TopicPopupMenuItem extends BaseWidget<Props> {
  onClick = e => {
    e.stopPropagation();
    const { config } = this.props;
    config.opType && this.operation(config.opType, this.props);
  };
  render() {
    const { config } = this.props;
    return (
      <MenuItem onClick={this.onClick}>
        <span className={cx('icon', 'iconfont', `bm-${config.icon}`)} />
        <MenuItemLabel className="label">{config.label}</MenuItemLabel>
      </MenuItem>
    );
  }
}
