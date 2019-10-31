import { KeyType, Model, OnChangeFunction } from '..';
import { Topic } from '../models/topic';

export interface IDiagram {}

export interface IControllerOption {
  diagram?: IDiagram;
  construct?: boolean;
  plugins?: Array<any>;
  commands?: Array<any>;
  model?: Model;
  readOnly?: boolean;
  onChange?: OnChangeFunction;
}

export interface IModifierArg {
  model: Model;
  topicKey?: KeyType;
  topic?: Topic;
  focusMode?: string;
  content?: any;
  desc?: any;
  style?: string;
}

export type IModifierResult = Model;
