import {
  Controller,
  FocusMode,
  IDiagram,
  IDiagramProps,
  Model,
  OnChangeFunction
} from '@blink-mind/core';
// TODO
import '@blink-mind/icons';
import { Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
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

@HotkeysTarget
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

  renderHotkeys() {
    const { controller, model } = this.diagramProps;
    const hotKeys: HotKeysConfig = controller.run(
      'customizeHotKeys',
      this.diagramProps
    );
    if (hotKeys === null) return null;
    if (
      !(
        hotKeys.topicHotKeys instanceof Map &&
        hotKeys.globalHotKeys instanceof Map
      )
    ) {
      throw new TypeError('topicHotKeys and globalHotKeys must be a Map');
    }
    const children = [];
    if (
      model.focusMode === FocusMode.NORMAL ||
      model.focusMode === FocusMode.SHOW_POPUP
    ) {
      hotKeys.topicHotKeys.forEach((v, k) => {
        children.push(<Hotkey key={k} {...v} global />);
      });
    }
    hotKeys.globalHotKeys.forEach((v, k) => {
      children.push(<Hotkey key={k} {...v} global />);
    });
    return <Hotkeys>{children}</Hotkeys>;
  }

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
