import { DiagramLayoutType, OpType } from '@blink-mind/core';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
import * as React from 'react';
import { Icon, iconClassName, IconName } from '../../../utils';
import { ToolbarItem, ToolbarItemPopoverTarget } from '../../common';

export function ToolbarItemLayout(props) {
  const layoutDirs = [
    [
      DiagramLayoutType.LEFT_AND_RIGHT,
      'Left And Right',
      'layout-left-and-right'
    ],
    [DiagramLayoutType.LEFT_TO_RIGHT, 'Only Right', 'layout-right'],
    [DiagramLayoutType.RIGHT_TO_LEFT, 'Only Left', 'layout-left']
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
    <ToolbarItem className={iconClassName(IconName.LAYOUT_LEFT_AND_RIGHT)}>
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
