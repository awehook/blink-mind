import * as React from 'react';
import { BaseWidget } from '@blink-mind/renderer-react';
import styled from 'styled-components';
import RichMarkDownEditor from 'awehook-rich-markdown-editor';
import debug from 'debug';
import { Controller, KeyType, Model } from '@blink-mind/core';
const log = debug('node:topic-content-editor');

interface NodeContentProps {
  readOnly?: boolean;
}

const NodeContent = styled.div<NodeContentProps>`
  padding: 6px;
  background-color: ${props => (props.readOnly ? null : 'white')};
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
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
    const { block, placeholder } = this.getCustomizeProps();
    log('placeholder', placeholder);
    const content = block.data;
    this.state = {
      content
    };
  }

  onMouseDown = e => {
    e.stopPropagation();
  };

  onMouseMove = e => {
    e.stopPropagation();
  };
  onChange(value) {
    this.setState({ content: value });
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
    const { readOnly, refKeyPrefix, placeholder } = this.getCustomizeProps();
    const content = this.state.content;
    if (content == null) return null;
    const key = `${refKeyPrefix}-${topicKey}`;
    const { onMouseDown, onMouseMove } = this;
    const richEditorProps = {
      editorValue: content,
      readOnly,
      onChange: this.onChange.bind(this),
      placeholder
    };

    const nodeContentProps = {
      key,
      readOnly,
      ref: this.rootRef(saveRef(key)),
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
