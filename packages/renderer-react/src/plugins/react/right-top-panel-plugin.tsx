import { Tab } from '@blueprintjs/core';
import * as React from 'react';
import { BaseProps } from '../../components/common';
import {
  RightTopPanelWidget,
  StyleEditor,
  ThemeEditor
} from '../../components/widgets';
import { TextStyleEditor } from '../../components/widgets/style-editor/text-style-editor';
import { getI18nText, I18nKey } from '../../utils';

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

    renderTextStyleEditor(ctx) {
      return <TextStyleEditor {...ctx} />;
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
