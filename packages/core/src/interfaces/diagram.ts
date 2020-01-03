import { Controller } from '../controller';
import { Model } from '../models';

export interface IDiagram {
  getDiagramProps(): IDiagramProps;
  openNewModel(newModel: Model);
}

export interface IDiagramProps {
  model: Model;
  controller: Controller;
}
