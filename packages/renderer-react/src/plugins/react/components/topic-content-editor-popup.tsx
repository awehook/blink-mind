import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
const log = debug('node:popup');

const Popup = styled.div`
  padding: 5px;
  //position: absolute;
  //left: 0;
  //top: 0;
`;

interface Props {
  handleVisibleChange: (boolean) => void;
}

export class TopicContentEditorPopup extends React.Component<Props> {
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
    return <Popup ref={this.rootRef}>{this.props.children}</Popup>;
  }
}
