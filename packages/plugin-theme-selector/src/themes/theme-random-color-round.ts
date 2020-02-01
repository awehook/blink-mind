import { ThemeType } from '@blink-mind/core';

export const themeRandomColorRound: ThemeType = {
  name: 'random-color-round',
  randomColor: true,
  background: 'rgb(57,60,65)',
  highlightColor: '#50C9CE',
  marginH: 60,
  marginV: 20,

  contentStyle: {
    lineHeight: '1.5'
  },

  linkStyle: {
    lineRadius: 5,
    lineType: 'curve',
    lineWidth: '3px'
  },

  rootTopic: {
    contentStyle: {
      fontSize: '34px',
      borderRadius: '35px',
      padding: '16px 18px 16px 18px'
    },
    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '3px',
      lineColor: 'rgb(113, 203, 45)'
    }
  },
  primaryTopic: {
    contentStyle: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '10px',
      fontSize: '17px',
      padding: '5px'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '2px',
      lineColor: 'rgb(113, 203, 45)'
    }
  },

  normalTopic: {
    contentStyle: {
      border: '1px solid #e8eaec',
      borderRadius: '10px',
      fontSize: '13px',
      padding: '0'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '2px',
      lineColor: 'white'
    }
  }
};
