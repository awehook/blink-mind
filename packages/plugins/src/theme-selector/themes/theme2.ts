import { ThemeType } from '@blink-mind/core';

export const theme2: ThemeType = {
  name: 'theme2',
  randomColor: false,
  background: '#F3E1E1',
  highlightColor: '#F5A623',
  marginH: 45,
  marginV: 10,
  contentStyle: {
    lineHeight: '1.5'
  },
  linkStyle: {
    lineRadius: 5,
    lineType: 'curve'
  },
  rootTopic: {
    contentStyle: {
      background: '#50C18A',
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
      background: '#ffffff',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgb(221, 170, 68)',
      borderRadius: '5px',
      color: 'rgb(103,103,103)',
      fontSize: '18px',
      padding: '5px'
    },

    subLinkStyle: {
      lineType: 'round',
      lineRadius: 5,
      lineWidth: '2px',
      lineColor: '#43a9ff'
    }
  },

  normalTopic: {
    contentStyle: {
      background: '#fff',
      borderRadius: '5px',
      color: 'rgb(103,103,103)',
      fontSize: '13px',
      padding: '0',
      boxShadow: '1px 1px 1px #ccc'
    },

    subLinkStyle: {
      lineType: 'round',
      lineRadius: 5,
      lineWidth: '1px',
      lineColor: '#43a9ff'
    }
  }
};
