export type LinkStyle = {
  lineType?: string;
  lineWidth?: number;
  lineColor?: string;
  lineRadius?: number;
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
  highlightColor: string;
  randomColor?: boolean;
  marginH: number;
  marginV: number;

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
