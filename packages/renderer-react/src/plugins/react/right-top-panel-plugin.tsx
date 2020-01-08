import { Tab } from '@blueprintjs/core';
import * as React from 'react';
import {
  RightTopPanel,
  RightTopPanelProps
} from '../../components/widgets/right-top-panel/right-top-panel';
import { StyleEditor } from '../../components/widgets/style-editor';
import { ThemeEditor } from '../../components/widgets/theme-editor';

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
      const styleEditorTab = controller.run('renderTopicStyleEditor', props);
      const themeEditorTab = controller.run('renderThemeEditor', props);

      return [styleEditorTab, themeEditorTab];
    },

    renderTopicStyleEditor(props) {
      const tProps = {
        id: 'topic-style',
        key: 'topic-style',
        title: 'TopicStyle',
        panel: <StyleEditor {...props} />
      };
      return <Tab {...tProps} />;
    },

    renderThemeEditor(props) {
      const tProps = {
        id: 'theme-editor',
        key: 'theme-editor',
        title: 'Theme',
        panel: <ThemeEditor {...props} />
      };
      return <Tab {...tProps} />;
    }
  };
}
