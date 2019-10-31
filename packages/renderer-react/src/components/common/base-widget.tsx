import * as React from 'react';

import { BaseProps } from '../BaseProps';

export class BaseWidget<
  P extends BaseProps = BaseProps,
  S = any
> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
  }

  operation(opType: string, arg: any) {
    this.props.controller.run('operation', {
      opType,
      ...arg
    });
  }

  get topic() {
    return this.props.model.getTopic(this.props.topicKey);
  }
}
