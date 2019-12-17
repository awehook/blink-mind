import { Controller, KeyType, Model, TopicStyle } from '@blink-mind/core';

export interface BaseProps {
  model: Model;
  topicKey?: KeyType;
  topicStyle?: TopicStyle;
  controller?: Controller;
  dir?: string;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScrollDelta?: Function;
  setViewBoxScroll?: Function;
  zoomFactor?: number;
}
