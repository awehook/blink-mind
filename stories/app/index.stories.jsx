import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseDemo, ToolBar, ToolBarItem,Icon } from '../common';
import { Diagram, iconClassName } from '@blink-mind/renderer-react';
import { JsonSerializerPlugin } from '@blink-mind/plugin-json-serializer';
import RichTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
import { ThemeSelectorPlugin } from '@blink-mind/plugin-theme-selector';
import TopologyDiagramPlugin from '@blink-mind/plugin-topology-diagram';
import TopicReferencePlugin from "@blink-mind/plugin-topic-reference";
import styled from 'styled-components';
import { Dialog, MenuItem, Menu, MenuDivider } from '@blueprintjs/core';
import { downloadFile } from '../utils';
import debug from 'debug';

const log = debug('story:app');





const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const DiagramContainer = styled.div`
  width: calc(100% - 18px);
  height: calc(100% - 36px);
`;

const plugins = [
  RichTextEditorPlugin(),
  ThemeSelectorPlugin(),
  TopicReferencePlugin(),
  TopologyDiagramPlugin(),
  JsonSerializerPlugin(),
];

class AppDemo extends BaseDemo {
  constructor(props) {
    super(props);
  }
  renderToolbar() {
    return (
      <ToolBar>
        <ToolBarItem onClick={this.onClickOpenFile}>
          <Icon className={iconClassName('openfile')} />
        </ToolBarItem>
        <ToolBarItem onClick={this.onClickExport}>
          <Icon className={iconClassName('export')} />
        </ToolBarItem>
        <ToolBarItem onClick={this.onClickChangeTheme}>
          <Icon className={iconClassName('theme')} />
        </ToolBarItem>
      </ToolBar>
    );
  }

  themeIndex = 1;
  onClickChangeTheme = () => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    let themeKeys = controller.run('getAllThemes', props).keys();
    themeKeys = Array.from(themeKeys);
    controller.run('setTheme', {
      ...props,
      themeKey: themeKeys[this.themeIndex++ % themeKeys.length]
    });
  };

  onClickOpenFile = e => {
    const input = document.createElement('input');
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    input.type = 'file';
    input.accept = '.json,.blinkmind,.bm';
    log('add onchange');
    input.addEventListener('change', evt => {
      const file = evt.target.files[0];
      const fr = new FileReader();
      log('add fr onload');
      fr.onload = evt => {
        const txt = evt.target.result;
        let obj = JSON.parse(txt);
        log('OpenFile:', obj);
        let model = controller.run('deserializeModel', { controller, obj });
        log('OpenFile:', model);
        this.diagram.openNewModel(model);
      };
      fr.readAsText(file);
    });
    input.click();
  };

  onClickExport = e => {
    this.setState({
      showDialog: true
    });
  };

  handleDialogClose = e => {
    this.setState({
      showDialog: false
    });
  };

  renderDialog() {
    return (
      <Dialog
        onClose={this.handleDialogClose}
        isOpen={this.state.showDialog}
        autoFocus
        enforceFocus
        usePortal
        title="Please select export file format"
      >
        <Menu>
          <MenuItem text="JSON(.json)" onClick={this.onClickExportJson} />
          <MenuDivider />
        </Menu>
      </Dialog>
    );
  }

  onClickExportJson = e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;

    const json = controller.run('serializeModel', props);
    const jsonStr = JSON.stringify(json);
    const url = `data:text/plain,${encodeURIComponent(jsonStr)}`;
    downloadFile(url, 'example.json');
    this.setState({ showDialog: false });
  };

  diagram;
  diagramRef = e => {
    this.diagram = e;
  };
  renderDiagram() {
    return (
      <Container>
        {this.renderToolbar()}
        {this.renderDialog()}
        <DiagramContainer>
          <Diagram
            model={this.state.model}
            onChange={this.onChange}
            plugins={plugins}
            ref={this.diagramRef}
          />
        </DiagramContainer>
      </Container>
    );
  }
}

storiesOf('app', module).add('app', () => <AppDemo />);
