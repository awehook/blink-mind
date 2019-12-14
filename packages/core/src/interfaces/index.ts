import { KeyType, Model, OnChangeFunction } from '..';
import { Topic } from '../models';

export interface IDiagram {}

export interface IControllerOption {
  diagram?: IDiagram;
  plugins?: Array<any>;
  model?: Model;
  readOnly?: boolean;
  onChange?: OnChangeFunction;
}

export interface IModifierArg {
  model: Model;
  topicKey?: KeyType;
  topic?: Topic;
  focusMode?: string;
  data?: any;
  desc?: any;
  style?: string;
  theme?: any;
  layoutDir?: any;
  zoomFactor?: number;
}

export type IModifierResult = Model;
