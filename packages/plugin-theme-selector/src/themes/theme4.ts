import { ThemeType } from '@blink-mind/core';

export const theme4: ThemeType = {
  name: 'theme3',
  randomColor: false,
  background: '#CCFBFE',
  highlightColor: '#D0021B',
  marginH: 50,
  marginV: 20,

  contentStyle: {
    lineHeight: '1.5'
  },

  linkStyle: {
    lineRadius: 5,
    lineType: 'curve'
  },

  rootTopic: {
    contentStyle: {
      background: '#CD8987',
      color: '#fff',
      fontSize: '34px',
      borderRadius: '5px',
      padding: '16px 18px 16px 18px'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '2px',
      lineColor: '#43a9ff'
    }
  },
  primaryTopic: {
    contentStyle: {
      background: '#CDACA1',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#E4C1F9',
      borderRadius: '5px',
      color: 'rgb(103,103,103)',
      fontSize: '18px',
      padding: '5px'
    },

    subLinkStyle: {
      lineType: 'line',
      lineWidth: '2px',
      lineColor: '#43a9ff'
    }
  },

  normalTopic: {
    contentStyle: {
      background: '#CDCACC',
      borderRadius: '5px',
      color: 'rgb(103,103,103)',
      fontSize: '13px',
      padding: '0',
      boxShadow: '1px 1px 1px #ccc'
    },

    subLinkStyle: {
      lineType: 'line',
      lineRadius: 5,
      lineWidth: '1px',
      lineColor: '#43a9ff'
    }
  }
};
