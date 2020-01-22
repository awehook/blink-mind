import { Tab } from '@blueprintjs/core';
import * as React from 'react';
import { BaseProps } from '../../components/common';
import { RightTopPanelWidget } from '../../components/widgets/right-top-panel';
import { StyleEditor } from '../../components/widgets/style-editor';
import { ThemeEditor } from '../../components/widgets/theme-editor';
import { I18nKey, getI18nText } from '../../utils';

export function RightTopPanelPlugin() {
  return {
    renderRightTopPanel(props: BaseProps) {
      const nProps: BaseProps = {
        ...props,
        key: 'right-top-panel'
      };
      return <RightTopPanelWidget {...nProps} />;
    },

    renderRightTopPanelTabs(props) {
      const { controller } = props;
      const styleEditorTab = controller.run('renderTopicStyleEditor', props);
      const themeEditorTab = controller.run('renderThemeEditor', props);

      return [styleEditorTab, themeEditorTab];
    },

    renderTopicStyleEditor(ctx) {
      const tProps = {
        id: 'topic-style',
        key: 'topic-style',
        title: getI18nText(ctx, I18nKey.TOPIC_STYLE),
        panel: <StyleEditor {...ctx} />
      };
      return <Tab {...tProps} />;
    },

    renderThemeEditor(props) {
      const tProps = {
        id: 'theme-editor',
        key: 'theme-editor',
        title: getI18nText(props, I18nKey.THEME),
        panel: <ThemeEditor {...props} />
      };
      return <Tab {...tProps} />;
    }
  };
}
