import { ThemeType } from '@blink-mind/core';

export const themeRandomColorSquare: ThemeType = {
  name: 'random-color-square',
  randomColor: true,
  background: 'rgb(57,60,65)',
  highlightColor: '#50C9CE',
  marginH: 60,
  marginV: 20,

  contentStyle: {
    lineHeight: '1.5',
    fontSize: '16px'
  },

  linkStyle: {
    lineRadius: 5,
    lineType: 'curve',
    lineWidth: '3px'
  },

  rootTopic: {
    contentStyle: {
      fontSize: '36px'
    },
    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '3px'
    }
  },
  primaryTopic: {
    contentStyle: {
      fontSize: '24px'
    },
    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '3px'
    }
  },

  normalTopic: {
    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '3px'
    }
  }
};
