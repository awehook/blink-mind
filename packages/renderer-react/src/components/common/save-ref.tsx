import * as React from 'react';

interface SaveRefProps {
  children: (
    saveRef: Function,
    getRef: Function,
    registerRefListener: Function
  ) => React.ReactNode;
}

type RefListener = (name: string, ref: HTMLElement) => void;

//TODO 可能会引起内存泄露
//需要使用WeakMap重构
export class SaveRef extends React.Component<SaveRefProps> {

  refMap = new WeakMap();

  getRef = name => {
    return this[name];
  };

  saveRef = name => {
    return node => {
      if (node) {
        this[name] = node;
        this.fireListener(name, node);
      }
    };
  };

  observers: Map<string, [RefListener]> = new Map();

  fireListener = (name: string, ref: HTMLElement) => {
    if (this.observers.has(name)) {
      const listeners = this.observers.get(name);
      for (const listener of listeners) {
        listener(name, ref);
      }
    }
  };

  registerRefListener = (name, listener: RefListener) => {
    if (!this.observers.has(name)) {
      this.observers.set(name, [listener]);
    } else {
      this.observers.get(name).push(listener);
    }
  };

  render() {
    return this.props.children(
      this.saveRef,
      this.getRef,
      this.registerRefListener.bind(this)
    );
  }
}
