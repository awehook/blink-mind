import {
  Controller,
  FocusMode,
  Model,
  OnChangeFunction
} from '@blink-mind/core';
// TODO
import '@blink-mind/icons';
import SimpleTextEditorPlugin from '@blink-mind/plugin-simple-text-editor';
import { Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
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

export interface IDiagramProps {
  model: Model;
  controller: Controller;
}

@HotkeysTarget
export class Diagram extends React.Component<Props> {
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
  }

  private diagramProps: IDiagramProps;

  private resolveController = memoizeOne(
    (plugins = [], commands, TheDefaultPlugin) => {
      const defaultPlugin = TheDefaultPlugin();
      this.controller = new Controller({
        plugins: [SimpleTextEditorPlugin(), plugins, defaultPlugin],
        commands,
        construct: false,
        onChange: this.props.onChange
      });
      // this.controller.run('onConstruct');
    }
  );

  renderHotkeys() {
    const { controller, model } = this.diagramProps;
    if (
      model.focusMode === FocusMode.NORMAL ||
      model.focusMode === FocusMode.SHOW_POPUP
    ) {
      const hotKeys = controller.run('customizeHotKeys', this.diagramProps);
      if (hotKeys === null) return null;
      if (!(hotKeys instanceof Map)) {
        throw new TypeError('customizeHotKeys must return a Map');
      }
      const children = [];
      hotKeys.forEach((v, k) => {
        children.push(<Hotkey key={k} {...v} global />);
      });
      return <Hotkeys>{children}</Hotkeys>;
    }
    return <Hotkeys />;
  }

  render() {
    const { commands, plugins } = this.props;
    this.resolveController(plugins, commands, DefaultPlugin);
    this.diagramProps = {
      ...this.props,
      controller: this.controller
      // TODO
      // diagram: this
    };
    return this.controller.run('renderDiagram', this.diagramProps);
  }
}
