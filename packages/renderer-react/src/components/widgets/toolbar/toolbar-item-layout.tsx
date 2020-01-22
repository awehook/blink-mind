import { DiagramLayoutType, OpType } from '@blink-mind/core';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
import * as React from 'react';
import {
  getI18nText,
  I18nKey,
  Icon,
  iconClassName,
  IconName
} from '../../../utils';
import { ToolbarItem, ToolbarItemPopoverTarget } from '../../common';

export function ToolbarItemLayout(props) {
  const layoutDirs = [
    [
      DiagramLayoutType.LEFT_AND_RIGHT,
      getI18nText(props, I18nKey.LEFT_AND_RIGHT),
      'layout-left-and-right'
    ],
    [
      DiagramLayoutType.LEFT_TO_RIGHT,
      getI18nText(props, I18nKey.ONLY_RIGHT),
      'layout-right'
    ],
    [
      DiagramLayoutType.RIGHT_TO_LEFT,
      getI18nText(props, I18nKey.ONLY_LEFT),
      'layout-left'
    ]
  ];

  const onClickSetLayout = layoutDir => e => {
    const { controller } = props;
    controller.run('operation', {
      ...props,
      opType: OpType.SET_LAYOUT_DIR,
      layoutDir
    });
  };

  return (
    <ToolbarItem
      className={iconClassName(IconName.LAYOUT_LEFT_AND_RIGHT)}
      {...props}
    >
      <Popover enforceFocus={false}>
        <ToolbarItemPopoverTarget />
        <Menu>
          {layoutDirs.map(dir => (
            <MenuItem
              key={dir[1]}
              icon={Icon(dir[2])}
              text={dir[1]}
              onClick={onClickSetLayout(dir[0])}
            />
          ))}
        </Menu>
      </Popover>
    </ToolbarItem>
  );
}
