import { ThemeType } from './types';

export const defaultTheme: ThemeType = {
  name: 'default',
  randomColor: false,
  background: '#f5f5f5',
  highlightColor: '#43a9ff',
  borderRadius: 6,
  marginH: 45,
  marginV: 10,
  contentStyle: {
    lineHeight: '1.5'
  },
  linkStyle: {
    lineRadius: 6
  },
  rootTopic: {
    contentStyle: {
      background: '#0181ca',
      color: '#fff',
      fontSize: '16px',
      borderRadius: '6px',
      padding: '16px 16px 16px 16px'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '4px',
      lineColor: '#0181ca'
    }
  },
  primaryTopic: {
    contentStyle: {
      background: '#ffffff',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#c4c4c4',
      borderRadius: '6px',
      color: 'rgb(103,103,103)',
      fontSize: '13px',
      padding: '6px 10px 5px 10px'
    },

    subLinkStyle: {
      lineType: 'round',
      lineRadius: 6,
      lineWidth: '3px',
      lineColor: '#2d8ecf'
    }
  },

  normalTopic: {
    contentStyle: {
      background: '#fff',
      borderRadius: '5px',
      color: 'rgb(103,103,103)',
      fontSize: '13px',
      padding: '3px 9px 4px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#c4c4c4',
      boxShadow: 'none', //'1px 1px 1px #ccc',
      display: 'flex'
    },

    subLinkStyle: {
      lineType: 'round',
      lineRadius: 5,
      lineWidth: '2px',
      lineColor: '#0181ca'
    }
  }
};
