import * as React from 'react';
import memoizeOne from 'memoize-one';
import { Model, Controller } from '@blink-mind/core';
import { ReactPlugin } from '../plugins/react';
import { SaveRef, DragScrollWidget } from './common';
import { MindDragScrollWidget } from './mind-drag-scroll-widget';
import Theme from './theme';
import styled from 'styled-components';

const DiagramRoot = styled.div`
  width: 100%;
  height: 100%;
`;

interface Props {
  model: Model;
  commands?: any;
  plugins?: any;
}

export class Diagram extends React.Component<Props> {
  controller: Controller;

  resolveController = memoizeOne((plugins = [], commands, TheReactPlugin) => {
    const reactPlugin = TheReactPlugin({
      ...this.props,
      diagram: this,
      model: this.props.model
    });
    this.controller = new Controller({
      plugins: [reactPlugin],
      commands,
      construct: false
    });
    this.controller.run('onConstruct');
  });

  render() {
    const { commands, plugins, model } = this.props;
    this.resolveController(plugins, commands, ReactPlugin);

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
