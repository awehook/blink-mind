import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Theme from '../../plugins/react/theme';
import { RefKey } from '../../utils';
import { MindDragScrollWidget } from './mind-drag-scroll-widget';

const Container = styled.div`
  width: 100%;
  //height: 100%;
  overflow: auto;
  flex-grow: 1;
  background: ${props => props.theme.background};
  position: relative;
`;
export function Canvas(props) {
  const { controller, saveRef, model } = props;
  const [diagramState, setDiagramState] = useState(
    controller.run('getInitialCanvasState', props)
  );
  const nProps = {
    ...props,
    diagramState,
    setDiagramState
  };
  return (
    <Theme theme={model.config.theme}>
      <Container ref={saveRef(RefKey.CANVAS_ROOT_KEY)}>
        {/*{React.createElement(MindDragScrollWidget, nProps)}*/}
        <MindDragScrollWidget {...nProps} />
        {controller.run('renderCanvasCustomize', nProps)}
      </Container>
    </Theme>
  );
}
