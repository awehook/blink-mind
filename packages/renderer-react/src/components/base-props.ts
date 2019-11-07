import {
  Controller,
  Model,
  TopicDirection,
  KeyType,
  TopicStyle
} from '@blink-mind/core';

export interface BaseProps {
  model: Model;
  topicKey?: KeyType;
  topicStyle?: TopicStyle;
  controller?: Controller;
  dir?: string;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScrollDelta?: Function;
}
