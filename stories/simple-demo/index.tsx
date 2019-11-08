import * as React from 'react';
import { Diagram } from '@blink-mind/renderer-react';
import { BaseDemo } from '../common/base-demo';



export class SimpleDemo extends BaseDemo {

  renderDiagram() {
    return (
      <Diagram
        model={this.state.model}
        onChange={this.onChange}
      />
    );
  }
}
