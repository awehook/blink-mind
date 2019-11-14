import { ThemeType } from '@blink-mind/core';

export const theme1: ThemeType = {
  name: 'theme1',
  randomColor: false,
  background: 'rgb(250,245,205)',
  highlightColor: '#50C9CE',
  marginH: 60,
  marginV: 60,
  subMarginH: 10,
  subMarginV: 20,
  fontFamily: '',
  bold: false,
  italic: false,
  textAlign: 'left',
  linkStyle: {
    lineWidth: 2,
    lineColor: 'orange',
    color: '#ffffff'
  },
  rootTopic: {
    background: 'rgb(221, 170, 68)',
    color: '#fff',
    fontSize: '34px',
    borderRadius: '5px',
    padding: '16px 18px 16px 18px'
  },
  primaryTopic: {
    background: '#e8eaec',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(221, 170, 68)',
    borderRadius: '5px',
    color: '#ffffff',
    fontSize: '17px',
    padding: '10px 15px 10px 15px',

    linkStyle: {
      lineType: 'curve',
      lineWidth: 2,
      lineColor: 'rgb(187, 136, 34)'
    }
  },

  normalTopic: {
    background: '#fff',
    border: '1px solid #e8eaec',
    borderRadius: '20px',
    color: 'rgb(187, 136, 34)',
    fontSize: '13px',
    padding: '4px 10px',

    linkStyle: {
      lineType: 'curve',
      lineWidth: 1,
      lineColor: 'rgb(187, 136, 34)'
    }
  }
};
