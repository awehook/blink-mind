import * as React from 'react';
import { TopicContentEditor } from '../components/topic-content-editor';
import { TopicContentEditor2 } from '../components/topic-content-editor-2';
import { TopicContentEditor3 } from '../components/topic-content-editor-3';
export default function RichTextEditorPlugin() {
  return {
    renderTopicContentEditor(props) {
      return <TopicContentEditor3 {...props} />;
    }
  };
}
