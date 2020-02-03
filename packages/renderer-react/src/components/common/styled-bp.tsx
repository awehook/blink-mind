import { Colors } from '@blueprintjs/core';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  .bp3-dark {
    color : ${Colors.GRAY5} !important;
    .bp3-card {
      //background-color: ${Colors.DARK_GRAY1} !important;
    }
    
    .bp3-button, .bp3-input, .bp3-menu-item, .bp3-tab, .bp3-drawer {
      color : ${Colors.GRAY5} !important;
    }
  }
`;
