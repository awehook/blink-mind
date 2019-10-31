import * as React from 'react';
import memoizeOne from 'memoize-one';
import { Model, Controller, OnChangeFunction } from '@blink-mind/core';
import { DefaultPlugin } from '../plugins';
import { LayoutPlugin } from '../plugins/layout';
import { SaveRef, DragScrollWidget } from './common';
import { MindDragScrollWidget } from './mind-drag-scroll-widget';
import Theme from './theme';
import styled from 'styled-components';
import './diagram.css';
import '@blueprintjs/core/lib/css/blueprint.css';

const DiagramRoot = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.background};
  position: relative;
`;

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
      plugins: [defaultPlugin],
      commands,
      construct: false,
      onChange: this.props.onChange
    });
    this.controller.run('onConstruct');
  });

  render() {
    const { commands, plugins, model } = this.props;
    this.resolveController(plugins, commands, DefaultPlugin);

    const children = (
      <SaveRef>
        {(saveRef, getRef) => (
          <Theme theme={model.config.theme}>
            <DiagramRoot>
              <MindDragScrollWidget
                controller={this.controller}
                model={model}
                saveRef={saveRef}
                getRef={getRef}
              />
              {this.controller.run('renderStyleEditor', {
                model,
                topicKey: model.focusKey,
                controller: this.controller
              })}
            </DiagramRoot>
          </Theme>
        )}
      </SaveRef>
    );

    return this.controller.run('renderDiagram', {
      ...this.props,
      diagram: this,
      children
    });
  }
}
