import { Controller, KeyType, Model } from '@blink-mind/core';
import { BaseWidget } from '@blink-mind/renderer-react';
import RichMarkDownEditor from 'awehook-rich-markdown-editor';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
const log = debug('node:topic-content-editor');

const NodeContent = styled.div`
  ${props =>
    !props.readOnly &&
    `
    // padding: 75px
    // min-width: 150px
    // min-height: 150px
  `};
`;
interface Props {
  controller: Controller;
  model: Model;
  readOnly: boolean;
  topicKey: KeyType;
  saveRef?: Function;
}

interface State {
  content: any;
}

export class RichTextEditor extends BaseWidget<Props, State> {
  constructor(props) {
    super(props);
    this.initState();
  }

  initState() {
    this.state = {
      content: this.getContent()
    };
  }

  getContent() {
    const { block } = this.getCustomizeProps();
    return block.data;
  }

  onMouseDown = e => {
    e.stopPropagation();
  };

  onMouseMove = e => {
    e.stopPropagation();
  };
  onChange(value) {
    this.setState({
      content: value
    });
  }

  getCustomizeProps() {
    return null;
  }

  componentDidMount() {
    document.addEventListener('click', this._handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleClick);
  }

  root;

  rootRef = saveRef => ref => {
    saveRef(ref);
    this.root = ref;
  };

  _handleClick = event => {
    const wasOutside = !this.root.contains(event.target);
    wasOutside && this.onClickOutSide(event);
  };

  onClickOutSide(e) {}

  render() {
    const { topicKey, saveRef } = this.props;
    const { readOnly, getRefKeyFunc, placeholder } = this.getCustomizeProps();
    log('readOnly:', readOnly);
    const content = readOnly ? this.getContent() : this.state.content;
    if (content == null) return null;
    const key = getRefKeyFunc(topicKey);
    const { onMouseDown, onMouseMove } = this;
    const richEditorProps = {
      editorValue: content,
      readOnly,
      onChange: this.onChange.bind(this),
      placeholder
    };

    const nodeContentProps = {
      key,
      ref: this.rootRef(saveRef(key)),
      readOnly,
      onMouseDown,
      onMouseMove
    };
    return (
      <NodeContent {...nodeContentProps}>
        <RichMarkDownEditor {...richEditorProps} />
      </NodeContent>
    );
  }
}
