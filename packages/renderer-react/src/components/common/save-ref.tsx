import debug from 'debug';
import * as React from 'react';

const log = debug('node:save-ref');

interface SaveRefProps {
  children: (
    saveRef: Function,
    getRef: Function,
    deleteRef: Function,
    registerRefListener: Function
  ) => React.ReactNode;
}

type RefListener = (name: string, ref: HTMLElement) => void;


export class SaveRef extends React.Component<SaveRefProps> {
  getRef = name => {
    // log(this);
    return this[name];
  };

  saveRef = name => {
    return node => {
      if (node) {
        this[name] = node;
        this.fireListener(name, node);
      } else {
        delete this[name];
      }
    };
  };

  deleteRef = name => {
    log('deleteRef:', name);
    delete this[name];
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
      this.deleteRef,
      this.registerRefListener.bind(this)
    );
  }
}
