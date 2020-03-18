import { ThemeType } from '@blink-mind/core';

export const darkTheme1: ThemeType = {
  name: 'dark-theme1',
  randomColor: false,
  background: '#2f2f2f',
  highlightColor: '#C31004',
  marginH: 50,
  marginV: 5,
  contentStyle: {
    lineHeight: '1'
  },

  linkStyle: {
    lineRadius: 5,
    lineWidth: '2px',
    lineColor: '#595959',
    lineType: 'curve'
  },

  rootTopic: {
    contentStyle: {
      background: '#C31004',
      color: '#fff',
      fontSize: '34px',
      borderRadius: '5px',
      padding: '16px 18px 16px 18px'
    },
    subLinkStyle: {
      lineType: 'curve'
    }
  },
  primaryTopic: {
    contentStyle: {
      background: 'rgba(100,100,100,1)',
      borderRadius: '5px',
      color: '#fff',
      fontSize: '14px',
      padding: '6px 10px 5px 10px'
    },

    subLinkStyle: {
      hasUnderline: true,
      lineType: 'round'
    }
  },

  normalTopic: {
    contentStyle: {
      borderRadius: '5px',
      background: '#fff0',
      color: '#fff',
      fontSize: '13px',
      padding: '1px'
    },

    subLinkStyle: {
      hasUnderline: true,
      lineType: 'round'
    }
  }
};
