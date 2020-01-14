import {
  Controller,
  IDiagram,
  IDiagramProps,
  Model,
  OnChangeFunction
} from '@blink-mind/core';
// TODO
import '@blink-mind/icons';

import '@blueprintjs/core/lib/css/blueprint.css';
import debug from 'debug';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import { DefaultPlugin } from '../plugins';
import './diagram.css';
const log = debug('node:Diagram');

interface Props {
  model: Model;
  onChange: OnChangeFunction;
  commands?: any;
  plugins?: any;
}

export class Diagram extends React.Component<Props> implements IDiagram {
  controller: Controller;

  public getDiagramProps(): IDiagramProps {
    return this.controller.run('getDiagramProps');
  }

  public openNewModel(newModel: Model) {
    const props = this.getDiagramProps();
    const { controller } = props;
    controller.run('openNewModel', {
      ...props,
      newModel
    });
  }

  private diagramProps: IDiagramProps;

  private resolveController = memoizeOne((plugins = [], TheDefaultPlugin) => {
    const defaultPlugin = TheDefaultPlugin();
    this.controller = new Controller({
      plugins: [plugins, defaultPlugin],
      onChange: this.props.onChange
    });
  });

  render() {
    const { plugins } = this.props;
    this.resolveController(plugins, DefaultPlugin);
    let { model } = this.props;
    if (!model) {
      model = this.controller.run('createNewModel');
    }
    this.diagramProps = {
      ...this.props,
      model,
      controller: this.controller
    };
    return this.controller.run('renderDiagram', this.diagramProps);
  }
}
