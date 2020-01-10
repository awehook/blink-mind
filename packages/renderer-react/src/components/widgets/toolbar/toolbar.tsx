import * as React from 'react';
import { BaseProps } from '../../common';
import { ToolbarRoot } from './styled';

export function Toolbar(props: BaseProps) {
  const { controller } = props;
  return (
    <ToolbarRoot>{controller.run('renderToolbarItems', props)}</ToolbarRoot>
  );
}
