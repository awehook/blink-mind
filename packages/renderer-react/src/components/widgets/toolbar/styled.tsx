import { Colors } from '@blueprintjs/core';
import styled from 'styled-components';
import { COLORS } from '../../../utils';

export const ToolbarRoot = styled.div`
  display: flex;
  align-items: center;
  padding: 0 !important;
  height: 60px;
  background-color: ${COLORS.LIGHT.TOOLBAR_BG};
  .bp3-dark & {
    background-color: ${COLORS.DARK.TOOLBAR_BG};
  }
  box-shadow: rgb(170, 170, 170) 0 0 2px;
`;
