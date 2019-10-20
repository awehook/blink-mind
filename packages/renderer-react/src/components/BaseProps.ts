import {
  Controller,
  Model,
  TopicWidgetDirection,
  KeyType
} from '@blink-mind/core';

export interface BaseProps {
  model: Model;
  topicKey?: KeyType;
  controller?: Controller;
  dir?: TopicWidgetDirection;
  saveRef?: Function;
  getRef?: Function;
}
