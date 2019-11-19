import { ThemeType } from '@blink-mind/core';

export const theme4: ThemeType = {
  name: 'theme3',
  randomColor: false,
  background: '#CCFBFE',
  highlightColor: '#50C9CE',
  marginH: 50,
  marginV: 20,
  fontFamily: '',
  bold: false,
  italic: false,
  textAlign: 'left',

  rootTopic: {
    background: '#CD8987',
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
    background: '#CDACA1',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#E4C1F9',
    borderRadius: '5px',
    color: 'rgb(103,103,103)',
    fontSize: '14px',
    padding: '6px 10px 5px 10px',

    linkStyle: {
      lineType: 'line',
      lineWidth: 2,
      lineColor: '#43a9ff'
    }
  },

  normalTopic: {
    background: '#CDCACC',
    borderRadius: '5px',
    color: 'rgb(103,103,103)',
    fontSize: '13px',
    padding: '3px 9px 4px',
    boxShadow: '1px 1px 1px #ccc',

    linkStyle: {
      lineType: 'line',
      lineRadius: 5,
      lineWidth: 1,
      lineColor: '#43a9ff'
    }
  }
};
