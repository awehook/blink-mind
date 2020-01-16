import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { RefKey } from '../../utils';
import { MindDragScrollWidget } from './mind-drag-scroll-widget';
const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const DiagramContainer = styled.div`
  width: 100%;
  //height: 100%;
  overflow: auto;
  flex-grow: 1;
  background: ${props => props.theme.background};
  position: relative;
`;
export function DiagramRoot(props) {
  const { controller, saveRef } = props;
  const [diagramState, setDiagramState] = useState(
    controller.run('getInitialDiagramState', props)
  );
  const nProps = {
    ...props,
    diagramState,
    setDiagramState
  };
  return (
    <Root>
      {controller.run('renderToolbar', props)}
      <DiagramContainer ref={saveRef(RefKey.DIAGRAM_ROOT_KEY)}>
        {/*{React.createElement(MindDragScrollWidget, nProps)}*/}
        <MindDragScrollWidget {...nProps} />
        {controller.run('renderDiagramCustomize', nProps)}
      </DiagramContainer>
    </Root>
  );
}
