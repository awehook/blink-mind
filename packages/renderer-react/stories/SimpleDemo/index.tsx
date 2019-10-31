import * as React from 'react';

import { Diagram } from '../../src';
import { Model } from '@blink-mind/core';
import './index.css';
interface Props {}

interface State {
  model: Model;
}

export class SimpleDemo extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const model = Model.create({
      rootTopicKey: 'root',
      topics: [
        { key: 'root', content: 'MainTopic', subKeys: ['sub1', 'sub2'] },
        {
          key: 'sub1',
          parentKey: 'root',
          content: 'SubTopic1',
          collapse: false
        },
        {
          key: 'sub2',
          parentKey: 'root',
          content: 'SubTopic2'
        }
      ]
    });
    this.state = {
      model
    };
  }
  onChange = (model: Model) => {
    this.setState({
      model
    });
  };

  render() {
    return (
      <div className="app">
        <Diagram model={this.state.model} onChange={this.onChange} />
      </div>
    );
  }
}
