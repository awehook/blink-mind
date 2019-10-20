import {KeyType, Model} from "..";
import {Topic} from "../models/topic";

export interface IDiagram {

}

export interface IControllerOption {
  diagram?: IDiagram;
  construct?: boolean;
  plugins?: Array<any>;
  commands?: Array<any>;
  model?: Model;
  readOnly?: boolean;
}

export interface IModifierArg {
  model: Model;
  topicKey?: KeyType;
  topic?: Topic,
  focusMode?: string;
  content?: any;
  desc?: any;
}


export type IModifierResult  = Model;