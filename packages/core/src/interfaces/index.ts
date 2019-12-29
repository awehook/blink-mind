import {
  Model,
  OnChangeFunction,
} from '..';

export interface IDiagram {}

export interface IControllerOption {
  diagram?: IDiagram;
  plugins?: Array<any>;
  model?: Model;
  readOnly?: boolean;
  onChange?: OnChangeFunction;
}

