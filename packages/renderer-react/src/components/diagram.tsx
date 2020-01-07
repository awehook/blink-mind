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
import { DefaultPlugin, HotKeysConfig } from '../plugins';
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
    const { model, controller } = props;
    controller.run('deleteRefKey', {
      ...props,
      topicKey: model.rootTopicKey
    });
    controller.change(newModel);
    setTimeout(() => {
      const props = this.getDiagramProps();
      const { model } = props;
      controller.run('moveTopicToCenter', {
        ...props,
        topicKey: model.focusKey
      });
    });
  }

  private diagramProps: IDiagramProps;

  private resolveController = memoizeOne((plugins = [], TheDefaultPlugin) => {
    const defaultPlugin = TheDefaultPlugin();
    this.controller = new Controller({
      plugins: [plugins, defaultPlugin],
      construct: false,
      onChange: this.props.onChange
    });
    // this.controller.run('onConstruct');
  });

  render() {
    const { plugins } = this.props;
    this.resolveController(plugins, DefaultPlugin);
    this.diagramProps = {
      ...this.props,
      controller: this.controller
    };
    return this.controller.run('renderDiagram', this.diagramProps);
  }
}
