import * as React from 'react';
import styled from 'styled-components';
import { BaseProps } from '../../../../components/common';
import { ToolbarRoot } from './styled';

export function Toolbar(props: BaseProps) {
  const { controller } = props;
  return (
    <ToolbarRoot>{controller.run('renderToolbarItems', props)}</ToolbarRoot>
  );
}
