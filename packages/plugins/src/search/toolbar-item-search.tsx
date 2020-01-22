import { OpType } from '@blink-mind/core';
import {
  iconClassName,
  IconName,
  ToolbarItem
} from '@blink-mind/renderer-react';
import * as React from 'react';
import { FOCUS_MODE_SEARCH } from './utils';

export function ToolbarItemSearch(props) {
  const onClickSearch = e => {
    const { controller } = props;

    controller.run('operation', {
      ...props,
      opType: OpType.SET_FOCUS_MODE,
      focusMode: FOCUS_MODE_SEARCH
    });
  };
  return (
    <ToolbarItem
      className={iconClassName(IconName.SEARCH)}
      onClick={onClickSearch}
      {...props}
    />
  );
}
