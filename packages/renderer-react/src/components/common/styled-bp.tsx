import { Colors } from '@blueprintjs/core';
import { createGlobalStyle } from 'styled-components';
import { COLORS } from '../../utils';

export const GlobalStyle = createGlobalStyle`
  .bp3-dark {
    color : ${Colors.GRAY5} !important;
    .bp3-card {
      background-color: ${COLORS.DARK.TOOLBAR_BG} !important;
    }
    
    .bp3-menu-item {
      &:active &:hover {
        background-color: ${COLORS.DARK.ITEM_BG_ACTIVE} !important;
      }
    }
    
    .bp3-button, .bp3-menu, .bp3-input, .bp3-menu-item, .bp3-tab, .bp3-drawer {
      color : ${COLORS.DARK.ITEM};
      background-color: ${COLORS.DARK.ITEM_BG} ;
    }
  }
`;
