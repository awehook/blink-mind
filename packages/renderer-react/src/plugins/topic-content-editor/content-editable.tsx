import React, { useRef } from 'react';
export interface ContentEditableProps {
  content: string;
  onChange: (s: string) => void;
}

export function ContentEditable(props) {
  const { content, onChange } = props;

  const ref = useRef();
  const lastHtml = content;
  const divProps = {
    ref,
    contentEditable: true,
    onInput: e => {
      if (e.target.innerHTML !== lastHtml) {
        onChange(e.target.innerHTML);
      }
    }
  };
  return <div {...divProps}>{content}</div>;
}
