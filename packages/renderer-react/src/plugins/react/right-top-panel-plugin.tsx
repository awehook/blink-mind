import { Tab } from '@blueprintjs/core';
import * as React from 'react';
import {
  RightTopPanel,
  RightTopPanelProps
} from './components/right-top-panel';
import { StyleEditor } from './components/style-editor';

export function RightTopPanelPlugin() {
  let selectedTabId = 'topic-style';
  const handleTabIdChange = tabId => {
    selectedTabId = tabId;
  };
  return {
    renderRightTopPanel(props) {
      const nProps: RightTopPanelProps = {
        ...props,
        key: 'right-top-panel',
        selectedTabId,
        handleTabIdChange
      };
      return <RightTopPanel {...nProps} />;
    },

    renderRightTopPanelTabs(props) {
      const { controller } = props;
      const styleEditorTab = controller.run('renderStyleEditor', props);

      return [styleEditorTab];
    },

    renderStyleEditor(props) {
      return (
        <Tab
          id="topic-style"
          key="topic-style"
          title="TopicStyle"
          panel={<StyleEditor {...props} />}
        ></Tab>
      );
    }
  };
}
