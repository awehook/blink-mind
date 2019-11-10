import * as React from 'react';
import { Model } from '@blink-mind/core';
import richTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
import {generateSimpleModel} from "../utils";
import './base-demo.css';

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
    this.state = {
      model
    };
  }

  renderDiagram() {
    return null
  }

  render() {
    return (
      <div className="app">
        {this.renderDiagram()}
      </div>
    );
  }
}
