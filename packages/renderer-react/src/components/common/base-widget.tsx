import * as React from 'react';

export interface BaseWidgetProps {}

export class BaseWidget<
  P extends BaseWidgetProps = BaseWidgetProps,
  S = any
> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
  }
}
