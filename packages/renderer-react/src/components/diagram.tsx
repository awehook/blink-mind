import {
  Controller,
  DocModel,
  FocusMode,
  IDiagram,
  IDiagramProps,
  OnChangeFunction
} from '@blink-mind/core';
import '@blink-mind/icons';
import { Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import debug from 'debug';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import { DefaultPlugin } from '../plugins';
import { HotKeysConfig } from '../types';
import './diagram.scss';
const log = debug('node:Diagram');

// controller 可以为空
interface Props {
  docModel: DocModel | null | undefined;
  onChange?: OnChangeFunction;
  controller?: Controller;
  commands?: any;
  plugins?: any;
}
@HotkeysTarget
class Diagram extends React.Component<Props> implements IDiagram {
  controller: Controller;

  public getDiagramProps(): IDiagramProps {
    return this.controller.run('getDiagramProps');
  }

  renderHotkeys() {
    const props = this.props;
    const controller = props.controller || this.controller;
    const model = controller.model;
    log('renderHotkeys', model);
    const hotKeys: HotKeysConfig = controller.run('customizeHotKeys', {
      ...props,
      controller
    });
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
      model.focusMode === FocusMode.SHOW_POPUP ||
      model.focusMode === FocusMode.EDITING_CONTENT
    ) {
      hotKeys.topicHotKeys.forEach((v, k) => {
        children.push(<Hotkey key={k} {...v} global />);
      });

      hotKeys.viewModeTopicHotKeys.has(model.config.viewMode) &&
        hotKeys.viewModeTopicHotKeys
          .get(model.config.viewMode)
          .forEach((v, k) => {
            children.push(<Hotkey key={k} {...v} global />);
          });
    }
    hotKeys.globalHotKeys.forEach((v, k) => {
      children.push(<Hotkey key={k} {...v} global />);
    });
    return <Hotkeys>{children}</Hotkeys>;
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
      docModel = this.controller.run('createNewDocModel', {
        controller: this.controller
      });
    }
    this.diagramProps = {
      ...this.props,
      docModel,
      controller: this.controller
    };
    return this.controller.run('renderDiagram', this.diagramProps);
  }
}

export { Diagram };
