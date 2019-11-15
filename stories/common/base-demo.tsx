import * as React from 'react';
import { Model } from '@blink-mind/core';
import { generateSimpleModel } from '../utils';
import './base-demo.css';
import debug from 'debug';
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
  onChange = (model: Model) => {
    this.setState({
      model
    });
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
