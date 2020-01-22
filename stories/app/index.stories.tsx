import { JsonSerializerPlugin } from '@blink-mind/plugin-json-serializer';
import RichTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
import { ThemeSelectorPlugin } from '@blink-mind/plugin-theme-selector';
import TopologyDiagramPlugin from '@blink-mind/plugin-topology-diagram';
import {
  ExportFilePlugin,
  OpenFilePlugin,
  SearchPlugin,
  TagsPlugin,
  TopicReferencePlugin,
  UndoRedoPlugin
} from '@blink-mind/plugins';
import {
  Diagram,
  iconClassName,
  IconName,
  ToolbarItem,
  ToolbarItemConfigs
} from '@blink-mind/renderer-react';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import styled from 'styled-components';
import { BaseDemo } from '../common';
// import debug from 'debug';
// const log = debug('story:app');

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

function ChangeThemePlugin() {
  let themeIndex = 1;
  function ToolbarItemTheme(props) {
    const onClickChangeTheme = () => {
      const { controller } = props;
      let themeKeys = controller.run('getAllThemes', props).keys();
      themeKeys = Array.from(themeKeys);
      controller.run('setTheme', {
        ...props,
        themeKey: themeKeys[themeIndex++ % themeKeys.length]
      });
    };
    return (
      <ToolbarItem
        className={iconClassName(IconName.THEME)}
        onClick={onClickChangeTheme}
        {...props}
      />
    );
  }
  return {
    customizeToolbar(props, next): ToolbarItemConfigs {
      const res: ToolbarItemConfigs = next();
      res.push({
        order: 30,
        element: ToolbarItemTheme
      });
      return res;
    }
  };
}

const plugins = [
  RichTextEditorPlugin(),
  ThemeSelectorPlugin(),
  TopicReferencePlugin(),
  SearchPlugin(),
  OpenFilePlugin(),
  ExportFilePlugin(),
  UndoRedoPlugin(),
  TagsPlugin(),
  ChangeThemePlugin(),
  TopologyDiagramPlugin(),
  JsonSerializerPlugin()
];

class AppDemo extends BaseDemo {
  constructor(props) {
    super(props);
  }

  initModel() {
    this.state = { model: null };
  }

  diagram;
  diagramRef = e => {
    this.diagram = e;
  };
  renderDiagram() {
    return (
      <Container>
        <Diagram
          model={this.state.model}
          onChange={this.onChange}
          plugins={plugins}
          ref={this.diagramRef}
        />
      </Container>
    );
  }
}

storiesOf('app', module).add('app', () => <AppDemo />);
