import debug from 'debug';
import * as React from 'react';
const log = debug('node:popup');

interface Props {
  handleVisibleChange: (boolean) => void;
}

export class Popup extends React.Component<Props> {
  componentDidMount() {
    document.addEventListener('click', this._handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleClick);
  }

  _handleClick = event => {
    log('_handleClick', event, this.root);
    const wasOutside = !this.root.contains(event.target);
    wasOutside &&
      this.props.handleVisibleChange &&
      this.props.handleVisibleChange(false);
  };

  root: HTMLElement;

  rootRef = ref => {
    this.root = ref;
  };

  render() {
    return <div ref={this.rootRef}>{this.props.children}</div>;
  }
}
