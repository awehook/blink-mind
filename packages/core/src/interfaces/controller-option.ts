import { Model, OnChangeFunction } from '@blink-mind/core';

export interface IControllerOption {
  plugins?: Array<any>;
  model?: Model;
  readOnly?: boolean;
  onChange?: OnChangeFunction;
}
