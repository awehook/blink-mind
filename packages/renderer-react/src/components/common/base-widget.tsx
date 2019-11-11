import * as React from 'react';

import { BaseProps } from '../base-props';

export class BaseWidget<
  P extends BaseProps = BaseProps,
  S = any
> extends React.PureComponent<P, S> {
  constructor(props: P) {
    super(props);
  }

  operation(opType: string, arg: any) {
    this.props.controller.run('operation', {
      opType,
      ...arg
    });
  }

  run(name: string, arg: any) {
    this.props.controller.run(name, arg);
  }

  get topic() {
    return this.props.model.getTopic(this.props.topicKey);
  }
}
