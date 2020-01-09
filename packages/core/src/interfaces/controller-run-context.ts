import { Controller, Model } from '@blink-mind/core';

export interface IControllerRunContext {
  controller: Controller;
  model?: Model;
  topicKey?: KeyType;
  getRef?: Function;
}
