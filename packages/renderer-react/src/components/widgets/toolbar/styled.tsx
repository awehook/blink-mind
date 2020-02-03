import { Colors } from '@blueprintjs/core';
import styled from 'styled-components';

export const ToolbarRoot = styled.div`
  padding: 0 !important;
  background-color: ${Colors.WHITE};
  .bp3-dark & {
    background-color: ${Colors.DARK_GRAY1};
  }
  box-shadow: rgb(170, 170, 170) 0 0 2px;
  .iconfont {
    font-size: 28px !important;
  }
`;
