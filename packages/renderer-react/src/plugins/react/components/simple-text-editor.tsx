import * as React from 'react';
import styled from 'styled-components';

const ContentEditable = styled.span`
  &:focus {
    outline: 0px;
  }
`;

interface Props {
  editorValue: any;
  readOnly: boolean;
  onChange: Function;
}

export class SimpleTextEditor extends React.Component<Props> {
  domNode;
  domNodeRef = ref => {
    this.domNode = ref;
  };
  render() {
    return (
      <ContentEditable
        ref={this.domNodeRef}
        // onInput={this.emitChange}
        onBlur={this.emitChange}
        contentEditable={!this.props.readOnly}
        suppressContentEditableWarning
      >
        {this.props.editorValue}
      </ContentEditable>
    );
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.domNode.innerHTML;
  }

  lastHtml: any;
  emitChange = () => {
    const html = this.domNode.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange(html);
    }
    this.lastHtml = html;
  };
}
