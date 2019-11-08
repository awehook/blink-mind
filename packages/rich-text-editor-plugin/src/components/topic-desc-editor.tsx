import * as React from 'react';
import { OpType } from '@blink-mind/renderer-react';
import debug from 'debug';
import {RichTextEditor} from "./rich-text-editor";
const log = debug('node:topic-desc-editor');



export class TopicDescEditor extends RichTextEditor {
  onChange = (value: () => string) => {
    this.operation(OpType.SET_TOPIC_DESC, { ...this.props, desc: value });
  };
}
