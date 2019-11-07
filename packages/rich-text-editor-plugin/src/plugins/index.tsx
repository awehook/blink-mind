import * as React from 'react';
import { TopicContentEditor } from '../components/topic-content-editor';

export default function RichTextEditorPlugin() {
  return {
    renderTopicContentEditor(props) {
      return <TopicContentEditor {...props} />;
    }
  };
}
