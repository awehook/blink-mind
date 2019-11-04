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
          subKeys: ['sub1_1','sub1_2'],
          collapse: false
        },
        {
          key: 'sub1_1',
          parentKey: 'sub1',
          content: 'SubTopic',
          collapse: false
        },
        {
          key: 'sub1_2',
          parentKey: 'sub1',
          content: 'SubTopic',
          collapse: false
        },
        {
          key: 'sub2',
          subKeys: ['sub2_1','sub2_2'],
          parentKey: 'root',
          content: 'SubTopic2'
        },
        {
          key: 'sub2_1',
          parentKey: 'sub2',
          content: 'SubTopic',
          collapse: false
        },
        {
          key: 'sub2_2',
          parentKey: 'sub2',
          content: 'SubTopic',
          collapse: false
        },
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
