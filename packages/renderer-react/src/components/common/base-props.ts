import { Controller, KeyType, Model, TopicStyle } from '@blink-mind/core';

export interface BaseProps {
  model: Model;
  topicKey?: KeyType;
  readOnly?: boolean;
  topicStyle?: TopicStyle;
  controller?: Controller;
  dir?: string;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScrollDelta?: Function;
  setViewBoxScroll?: Function;
  zoomFactor?: number;
  zIndex?: number;
  diagramState: any;
  setDiagramState: (any) => void;
}
