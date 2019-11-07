import * as React from 'react';
import memoizeOne from 'memoize-one';
import { Model, Controller, OnChangeFunction } from '@blink-mind/core';
import { DefaultPlugin } from '../plugins';
import './diagram.css';
import '@blueprintjs/core/lib/css/blueprint.css';

interface Props {
  model: Model;
  onChange: OnChangeFunction;
  commands?: any;
  plugins?: any;
}

export class Diagram extends React.Component<Props> {
  controller: Controller;

  resolveController = memoizeOne((plugins = [], commands, TheDefaultPlugin) => {
    const defaultPlugin = TheDefaultPlugin();
    this.controller = new Controller({
      plugins: [plugins, defaultPlugin],
      commands,
      construct: false,
      onChange: this.props.onChange
    });
    this.controller.run('onConstruct');
  });

  render() {
    const { commands, plugins, model } = this.props;
    this.resolveController(plugins, commands, DefaultPlugin);

    return this.controller.run('renderDiagram', {
      ...this.props,
      controller: this.controller,
      model,
      diagram: this
    });
  }
}
