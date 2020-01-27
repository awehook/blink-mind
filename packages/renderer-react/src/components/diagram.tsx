import {
  CanvasModel,
  Controller,
  DocModel,
  IDiagram,
  IDiagramProps,
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
  docModel: DocModel | null | undefined;
  onChange?: OnChangeFunction;
  controller?: Controller;
  commands?: any;
  plugins?: any;
}

export class Diagram extends React.Component<Props> implements IDiagram {
  controller: Controller;

  public getDiagramProps(): IDiagramProps {
    return this.controller.run('getDiagramProps');
  }

  public openNewDocModel(newModel: DocModel) {
    const props = this.getDiagramProps();
    const { controller } = props;
    controller.run('openNewDocModel', {
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
    const { plugins, controller } = this.props;
    if (controller) this.controller = controller;
    else this.resolveController(plugins, DefaultPlugin);
    let { docModel } = this.props;
    if (!docModel) {
      docModel = this.controller.run('createNewDoc');
    }
    this.diagramProps = {
      ...this.props,
      docModel,
      controller: this.controller
    };
    return this.controller.run('renderDiagram', this.diagramProps);
  }
}
