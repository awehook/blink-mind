import { DocModel } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import { generateSimpleModel } from '../utils';
import './base-demo.css';
const log = debug('story:base-demo');

interface Props {}

interface State {
  docModel: DocModel;
}

export class BaseDemo extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.initModel();
  }
  onChange = (docModel: DocModel, callback?: () => void) => {
    this.setState(
      {
        docModel
      },
      callback
    );
  };

  initModel() {
    // const model = generateSimpleModel();
    // log('initModel:', model);
    // this.state = {
    //   model
    // };
  }

  renderDiagram() {
    return null;
  }

  render() {
    return <div className="app">{this.renderDiagram()}</div>;
  }
}
