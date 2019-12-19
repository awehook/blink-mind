import { ThemeType } from './types';

export const defaultTheme: ThemeType = {
  name: 'default',
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
    lineWidth: 3
  },

  rootTopic: {
    contentStyle: {
      fontSize: '34px',
      borderRadius: '35px',
      padding: '16px 18px 16px 18px'
    },
    subLinkStyle: {
      lineType: 'curve',
      lineWidth: 3,
      lineColor: 'rgb(113, 203, 45)'
    }
  },
  primaryTopic: {
    contentStyle: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '20px',
      fontSize: '17px',
      padding: '10px 15px 10px 15px'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: 3,
      lineColor: 'rgb(113, 203, 45)'
    }
  },

  normalTopic: {
    contentStyle: {
      border: '1px solid #e8eaec',
      borderRadius: '20px',
      fontSize: '17px',
      padding: '4px 10px'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: 3,
      lineColor: 'white'
    }
  }
};
