export type LinkStyle = {
  lineType?: string;
  lineWidth?: number;
  lineColor?: string;
};

export type TopicStyle = {
  background?: string;
  color?: string;
  fontSize?: string;
  borderRadius: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  padding?: string;

  linkStyle?: LinkStyle;
};

export type ThemeType = {
  name: string;
  background: string;
  randomColor?: boolean;
  marginH: number;
  marginV: number;

  subMarginH: number;
  subMarginV: number;

  fontFamily: string;
  bold: boolean;
  italic: boolean;
  textAlign: string;

  linkStyle?: LinkStyle;
  rootTopic?: TopicStyle;
  primaryTopic?: TopicStyle;
  normalTopic?: TopicStyle;
};

interface Themes {
  [fieldName: string]: ThemeType;
}

export const themes: Themes = {
  default: {
    name: 'default',
    randomColor: true,
    background: 'rgb(57,60,65)',
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
      background: '#ff8200',
      color: '#fff',
      fontSize: '34px',
      borderRadius: '35px',
      padding: '16px 18px 16px 18px'
    },
    primaryTopic: {
      background: '#e8eaec',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgb(187,187,187)',
      borderRadius: '20px',
      color: 'rgb(68,68,68)',
      fontSize: '17px',
      padding: '10px 15px 10px 15px',

      linkStyle: {
        lineType: 'curve',
        lineWidth: 3,
        lineColor: 'rgb(113, 203, 45)'
      }
    },

    normalTopic: {
      background: '#fff',
      border: '1px solid #e8eaec',
      borderRadius: '20px',
      color: 'rgb(68,68,68)',
      fontSize: '17px',
      padding: '4px 10px',

      linkStyle: {
        lineType: 'curve',
        lineWidth: 3,
        lineColor: 'white'
      }
    }
  }
};
