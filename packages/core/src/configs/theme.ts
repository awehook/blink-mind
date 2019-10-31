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

  linkStyle: {
    lineWidth: number;
    lineColor: string;
    color: string;
  };

  rootTopic: {
    backgroundColor: string;
    color: string;
    fontSize: string;
    borderRadius?: string;
    border?: string;
    padding?: string;
  };

  primaryTopic: {
    backgroundColor: string;
    color: string;
    fontSize: string;
    borderRadius: string;
    border: string;
    padding: string;

    linkStyle: {
      lineType: string;
      lineWidth: number;
      lineColor: string;
    };
  };

  normalTopic: {
    backgroundColor: string;
    color: string;
    fontSize: string;
    borderRadius: string;
    border: string;
    padding: string;

    linkStyle: {
      lineType: string;
      lineWidth: number;
      lineColor: string;
    };
  };
};

interface Themes {
  [fieldName: string]: ThemeType;
}

export const themes: Themes = {
  default: {
    name: 'default',
    background: '#f8f8f8',
    marginH: 26,
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
      backgroundColor: 'red',
      color: '#fff',
      fontSize: '26px',
      borderRadius: '5px',
      padding: '14px'
    },
    primaryTopic: {
      backgroundColor: '#fff',
      border: '1px solid rgb(187,187,187)',
      borderRadius: '5px',
      color: 'rgb(68,68,68)',
      fontSize: '17px',
      padding: '12px',

      linkStyle: {
        lineType: 'curve',
        lineWidth: 1,
        lineColor: 'rgb(113, 203, 45)'
      }
    },

    normalTopic: {
      backgroundColor: '#fff',
      border: '1px solid rgb(187,187,187)',
      borderRadius: '5px',
      color: 'rgb(68,68,68)',
      fontSize: '17px',
      padding: '12px',

      linkStyle: {
        lineType: 'curve',
        lineWidth: 1,
        lineColor: 'rgb(113, 203, 45)'
      }
    }
  }
};
