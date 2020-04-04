import deepEqual from 'fast-deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
const log = require('debug')('node:content-editable');

function normalizeHtml(str: string): string {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ');
}

function replaceCaret(el: HTMLElement) {
  log('replaceCaret', el.innerHTML);
  // Place the caret at the end of the element
  const target = document.createTextNode('');
  el.appendChild(target);
  // do not move caret if element was not focused
  // const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null) {
    const sel = window.getSelection();
    if (sel !== null) {
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

/**
 * A simple component for an html element with editable contents.
 */
export default class ContentEditable extends React.Component<Props> {
  lastHtml: string = this.props.html;
  el: any =
    typeof this.props.innerRef === 'function'
      ? { current: null }
      : React.createRef<HTMLElement>();

  getEl = () =>
    (this.props.innerRef && typeof this.props.innerRef !== 'function'
      ? this.props.innerRef
      : this.el
    ).current;

  render() {
    const {
      tagName,
      html,
      innerRef,
      handleKeyDown,
      handleOnInput,
      handleOnPaste,
      focus,
      ...props
    } = this.props;

    return React.createElement(
      tagName || 'div',
      {
        ...props,
        ref:
          typeof innerRef === 'function'
            ? (current: HTMLElement) => {
                innerRef(current);
                this.el.current = current;
              }
            : innerRef || this.el,
        onInput: this.onInput,
        onBlur: this.onBlur,
        // onKeyUp: this.props.onKeyUp || this.emitChange,
        onKeyDown: this.onKeyDown,
        onPaste: handleOnPaste,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: { __html: html }
      },
      this.props.children
    );
  }
  emitChange = (originalEvt: React.SyntheticEvent<any>) => {
    log('emitChange');
    const el = this.getEl();
    if (!el) return;

    const html = el.innerHTML;
    // if (this.props.onChange && html !== this.lastHtml) {
    // 为了考虑到在一个节点上面快速输入，切换到另一个节点，第一个节点上输入的内容无法撤销这种情况
    if (this.props.onChange) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html
        }
      });
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  };
  onInput = e => {
    log('onInput');
    if (this.props.handleOnInput && this.props.handleOnInput(e)) return;
    this.emitChange(e);
  };

  onBlur = e => {
    this.emitChange(e);
  };

  onKeyDown = e => {
    // log('onKeyDown', e.target.innerHTML);
    if (this.props.handleKeyDown && this.props.handleKeyDown(e)) {
      e.preventDefault();
      return false;
    }

    // this.emitChange(e);
  };

  shouldComponentUpdate(nextProps: Props): boolean {
    const { props } = this;
    const el = this.getEl();

    // We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump

    // Rerender if there is no element yet... (somehow?)
    if (!el) return true;

    // ...or if html really changed... (programmatically, not by user edit)
    if (normalizeHtml(nextProps.html) !== normalizeHtml(el.innerHTML)) {
      return true;
    }
    // Handle additional properties
    const res =
      props.focus !== nextProps.focus ||
      props.disabled !== nextProps.disabled ||
      props.tagName !== nextProps.tagName ||
      props.className !== nextProps.className ||
      props.innerRef !== nextProps.innerRef ||
      !deepEqual(props.style, nextProps.style);
    // log('shouldComponentUpdate',res);
    return res;
  }

  componentDidMount(): void {
    const el = this.getEl();
    if (!el) {
      return;
    }

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.html !== el.innerHTML) {
      el.innerHTML = this.lastHtml = this.props.html;
    }
    this.props.focus && replaceCaret(el);
  }

  componentDidUpdate() {
    log('componentDidUpdate');
    const el = this.getEl();
    if (!el) {
      return;
    }

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.html !== el.innerHTML) {
      el.innerHTML = this.lastHtml = this.props.html;
    }
    this.props.focus && replaceCaret(el);
  }

  static propTypes = {
    html: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    tagName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
  };
}

export type ContentEditableEvent = React.SyntheticEvent<any, Event> & {
  target: { value: string };
};
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
type DivProps = Modify<
  JSX.IntrinsicElements['div'],
  { onChange: (event: ContentEditableEvent) => void }
>;

export interface Props extends DivProps {
  html: string;
  disabled?: boolean;
  focus?: boolean;
  tagName?: string;
  className?: string;
  style?: Object;
  innerRef?: React.RefObject<HTMLElement> | Function;
  handleKeyDown?: (e) => boolean;
  handleOnInput?: (e) => boolean;
  handleOnPaste?: (e) => void;
}
