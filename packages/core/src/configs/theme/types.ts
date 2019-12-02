export type LinkStyle = {
  lineType?: string;
  lineWidth?: number;
  lineColor?: string;
  lineRadius?: number;
};

export type TopicContentStyle = {
  background?: string;
  color?: string;
  fontSize?: string;
  lineHeight?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  padding?: string;
};

export type TopicStyle = {
  contentStyle?: TopicContentStyle;
  linkStyle?: LinkStyle;
  subLinkStyle?: LinkStyle;
};

export type ThemeType = {
  name: string;
  background: string;
  highlightColor: string;
  randomColor?: boolean;
  marginH: number;
  marginV: number;

  contentStyle?: TopicContentStyle;
  linkStyle?: LinkStyle;

  rootTopic?: TopicStyle;
  primaryTopic?: TopicStyle;
  normalTopic?: TopicStyle;
};

interface Themes {
  [fieldName: string]: ThemeType;
}
