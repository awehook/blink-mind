import { Model, OnChangeFunction } from '@blink-mind/core';
import { IDiagram } from './diagram';

export interface IControllerOption {
  diagram?: IDiagram;
  plugins?: Array<any>;
  model?: Model;
  readOnly?: boolean;
  onChange?: OnChangeFunction;
}
