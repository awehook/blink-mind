import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseDemo } from '../common/base-demo';
import { Diagram, iconClassName } from '@blink-mind/renderer-react';
import { ThemeSelectorPlugin } from '@blink-mind/plugin-theme-selector';
import styled from 'styled-components';

const ToolBar = styled.div`
  width: calc(100% - 18px);
  height: 36px;
  background: white;
  //border-bottom: 1px solid #e5e5e5;
  //box-shadow: 0 3px 2px -2px rgba(200, 200, 200, 0.15);
`;

const ToolBarItem = styled.div`
  padding: 5px;
  width: 36px;
  height: 36px;
  cursor: pointer;
`;

const Icon = styled.div`
  width: 26px;
  height: 26px;
  font-size: 26px !important;
  &:hover {
    color: #106ba3;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const DiagramContainer = styled.div`
  width: calc(100% - 18px);
  height: calc(100% - 36px);
`;

const plugins = [ThemeSelectorPlugin()];
class ThemeSelectorDemo extends BaseDemo {
  themeIndex = 0;
  onClickChangeTheme = () => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    let themeKeys = controller.run('getAllThemes', props).keys();
    themeKeys = Array.from(themeKeys);
    controller.run('selectTheme', {
      ...props,
      themeKey: themeKeys[this.themeIndex++ % themeKeys.length]
    });
  };
  renderToolbar() {
    return (
      <ToolBar>
        <ToolBarItem onClick={this.onClickChangeTheme}>
          <Icon className={iconClassName('theme')} />
        </ToolBarItem>
      </ToolBar>
    );
  }
  diagram: Diagram;
  diagramRef = e => {
    this.diagram = e;
  };
  renderDiagram() {
    return (
      <Container>
        {this.renderToolbar()}
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

storiesOf('theme-selector-demo', module).add(
  'theme-selector',
  () => <ThemeSelectorDemo />,
  {}
);
