import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseDemo } from '../common/base-demo';
import { Diagram, iconClassName, Icon } from '@blink-mind/renderer-react';
import { ThemeSelectorPlugin } from '@blink-mind/plugin-theme-selector';
import { Popover, Menu, MenuItem } from '@blueprintjs/core';
import styled from 'styled-components';
import { DiagramLayoutType } from '@blink-mind/core';

const ToolBar = styled.div`
  width: calc(100% - 18px);
  height: 36px;
  background: white;
`;

const ToolBarItem = styled.div`
  padding: 5px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: inline-block;
`;

const ToolBarIcon = styled.div`
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
  onClickSetLayout = layoutDir => e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run('setLayoutDir', {
      ...props,
      layoutDir
    });
  };
  renderToolbar() {
    const layoutDirs = [
      [
        DiagramLayoutType.LEFT_AND_RIGHT,
        'Left And Right',
        'layout-left-and-right'
      ],
      [DiagramLayoutType.LEFT_TO_RIGHT, 'Only Right', 'layout-right'],
      [DiagramLayoutType.RIGHT_TO_LEFT, 'Only Left', 'layout-left']
    ];
    return (
      <ToolBar>
        <ToolBarItem onClick={this.onClickChangeTheme}>
          <ToolBarIcon className={iconClassName('theme')} />
        </ToolBarItem>
        <ToolBarItem>
          <Popover enforceFocus={false}>
            <ToolBarIcon className={iconClassName('layout-left-and-right')} />
            <Menu>
              {layoutDirs.map(dir => (
                <MenuItem
                  key={dir[1]}
                  icon={Icon(dir[2])}
                  text={dir[1]}
                  onClick={this.onClickSetLayout(dir[0])}
                />
              ))}
            </Menu>
          </Popover>
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
