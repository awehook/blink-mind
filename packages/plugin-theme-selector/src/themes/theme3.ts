import { ThemeType } from '@blink-mind/core';

export const theme3: ThemeType = {
  name: 'theme3',
  randomColor: false,
  background: '#A9DEF9',
  highlightColor: '#50C9CE',
  marginH: 60,
  marginV: 60,
  subMarginH: 10,
  subMarginV: 20,
  fontFamily: '',
  bold: false,
  italic: false,
  textAlign: 'left',

  rootTopic: {
    background: '#FF99C8',
    color: '#fff',
    fontSize: '34px',
    borderRadius: '5px',
    padding: '16px 18px 16px 18px',
    linkStyle: {
      lineType: 'curve',
      lineWidth: 2,
      lineColor: 'rgb(113, 203, 45)'
    }
  },
  primaryTopic: {
    background: '#FCF6BD',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#E4C1F9',
    borderRadius: '5px',
    color: 'rgb(103,103,103)',
    fontSize: '14px',
    padding: '6px 10px 5px 10px',

    linkStyle: {
      lineType: 'curve',
      lineWidth: 2,
      lineColor: '#43a9ff'
    }
  },

  normalTopic: {
    background: '#E4FDE1',
    borderRadius: '5px',
    color: 'rgb(103,103,103)',
    fontSize: '13px',
    padding: '3px 9px 4px',
    boxShadow: '1px 1px 1px #ccc',

    linkStyle: {
      lineType: 'round',
      lineRadius: 5,
      lineWidth: 1,
      lineColor: '#43a9ff'
    }
  }
};
