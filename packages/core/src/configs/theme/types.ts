export type LinkStyle = {
  lineType?: string;
  lineWidth?: string;
  lineColor?: string;
  lineRadius?: number;
};

export type TopicContentStyle = {
  [key: string]: any;
  background?: string;
  color?: string;
  fontSize?: string;
  lineHeight?: string;
  border?: string;
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

export function isThemeType(obj: any): boolean {
  return (
    obj.name != null && obj.background != null && obj.highlightColor != null
  );
}

export interface Themes {
  [fieldName: string]: ThemeType;
}
