import { Model } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import { generateSimpleModel } from '../utils';
import './base-demo.css';
const log = debug('story:base-demo');

interface Props {}

interface State {
  model: Model;
}

export class BaseDemo extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.initModel();
  }
  onChange = (model: Model, callback?: () => void) => {
    this.setState(
      {
        model
      },
      callback
    );
  };

  initModel() {
    const model = generateSimpleModel();
    log('initModel:', model);
    this.state = {
      model
    };
  }

  renderDiagram() {
    return null;
  }

  render() {
    return <div className="app">{this.renderDiagram()}</div>;
  }
}
