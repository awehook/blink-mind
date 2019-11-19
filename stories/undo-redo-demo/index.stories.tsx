import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseDemo } from '../common/base-demo';
import { Diagram, iconClassName } from '@blink-mind/renderer-react';
import styled from 'styled-components';

const ToolBar = styled.div`
  width: calc(100% - 18px);
  height: 36px;
  background: white;
`;

const ToolBarItem = styled.div`
  padding: 5px;
  width: 36px;
  height: 36px;
  cursor: ${props => (props.enable ? 'pointer' : 'not-allowed')};
  color: ${props => (props.enable ? 'black' : 'grey')};
  ${props =>
    props.enable &&
    `&:hover {
    color: #106ba3;
  }`};
  display: inline-block;
`;

const Icon = styled.div`
  width: 26px;
  height: 26px;
  font-size: 26px !important;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const DiagramContainer = styled.div`
  width: calc(100% - 18px);
  height: calc(100% - 36px);
`;

class UndoRedoDemo extends BaseDemo {
  onClickUndo = () => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run('undo', props);
  };

  onClickRedo = () => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run('redo', props);
  };

  renderToolbar() {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    const canUndo = controller.run('canUndo', props);
    const canRedo = controller.run('canRedo', props);

    return (
      <ToolBar>
        <ToolBarItem onClick={this.onClickUndo} enable={canUndo}>
          <Icon className={iconClassName('undo')} />
        </ToolBarItem>
        <ToolBarItem onClick={this.onClickRedo} enable={canRedo}>
          <Icon className={iconClassName('redo')} />
        </ToolBarItem>
      </ToolBar>
    );
  }
  diagram: Diagram;
  diagramRef = e => {
    this.diagram = e;
    this.setState({});
  };
  renderDiagram() {
    return (
      <Container>
        {this.diagram && this.renderToolbar()}
        <DiagramContainer>
          <Diagram
            model={this.state.model}
            onChange={this.onChange}
            ref={this.diagramRef}
          />
        </DiagramContainer>
      </Container>
    );
  }
}

storiesOf('undo-redo-demo', module).add(
  'undo-redo',
  () => <UndoRedoDemo />,
  {}
);
