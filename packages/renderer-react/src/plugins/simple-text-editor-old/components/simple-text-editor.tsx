import { Controller, KeyType, SheetModel } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import plainSerializer from 'slate-plain-serializer';
import { Editor } from 'slate-react';
import styled from 'styled-components';
const log = debug('node:text-editor');

interface ContentProps {
  readOnly?: boolean;
}

const Content = styled.div<ContentProps>`
  padding: 6px;
  background-color: ${props => (props.readOnly ? null : 'white')};
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
  min-width: 50px;
`;

interface Props {
  controller: Controller;
  model: SheetModel;
  readOnly: boolean;
  topicKey: KeyType;
  saveRef?: Function;
}

interface State {
  content: any;
}

export class SimpleTextEditor extends React.PureComponent<Props, State> {
  state = {
    content: null
  };

  protected onMouseDown(e) {
    e.stopPropagation();
    if (!this.handleClick) {
      // log('this.handleClick = this._handleClick.bind(this)');
      this.handleClick = this._handleClick.bind(this);
    }
    log('addEventListener', this.props.topicKey);
    document.removeEventListener('click', this.handleClick);
    document.addEventListener('click', this.handleClick, {
      capture: true
    });
  }

  onMouseMove = e => {
    // log('onMouseMove');
    // e.stopPropagation();
  };
  onChange({ value }) {
    // log('onChange', value);
    this.setState({ content: value });
  }

  onKeyDown = e => {};

  handleClick;

  _handleClick = event => {
    if (this.root) {
      const wasOutside = !this.root.contains(event.target);
      wasOutside && this.onClickOutSide(event);
    }
  };

  onClickOutSide(e) {
    log('removeEventListener', this.props.topicKey);
    document.removeEventListener('click', this.handleClick);
  }

  getCustomizeProps() {
    return null;
  }

  constructor(props) {
    super(props);
    this.initState();
  }

  getContent() {
    const { block } = this.getCustomizeProps();
    let content = block.data;
    if (content == null) return null;
    if (typeof content === 'string') {
      content = plainSerializer.deserialize(content);
    }
    return content;
  }

  initState() {
    const content = this.getContent();
    this.state = {
      content
    };
  }

  root;

  rootRef = saveRef => ref => {
    saveRef(ref);
    this.root = ref;
  };

  render() {
    const { topicKey, saveRef } = this.props;
    const {
      readOnly,
      getRefKeyFunc,
      placeholder,
      style
    } = this.getCustomizeProps();
    // log(readOnly);
    const key = getRefKeyFunc(topicKey);
    const content = readOnly ? this.getContent() : this.state.content;
    const { onMouseDown, onMouseMove, onKeyDown } = this;
    const editorProps = {
      value: content,
      readOnly,
      onChange: this.onChange.bind(this),
      placeholder,
      style
    };

    const contentProps = {
      key,
      readOnly,
      ref: this.rootRef(saveRef(key)),
      onMouseDown: onMouseDown.bind(this),
      onMouseMove,
      onKeyDown
    };
    return (
      <Content {...contentProps}>
        <Editor {...editorProps} autoFocus />
      </Content>
    );
  }
}
