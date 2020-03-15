import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { RefKey } from '../../../utils';
import { MindDragScrollWidget } from '../mind-drag-scroll-widget';
import { BaseProps } from '../../common';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  flex-grow: 1;
  background: ${props => props.theme.background};
  position: relative;
`;
export function MindMapSheet(props: BaseProps) {
  const { controller, saveRef, model } = props;
  const [diagramState, setDiagramState] = useState(
    controller.run('getInitialSheetState', props)
  );
  const nProps = {
    ...props,
    diagramState,
    setDiagramState
  };
  return (
    <Container ref={saveRef(RefKey.SHEET_ROOT_KEY + model.id)}>
      {/*{React.createElement(MindDragScrollWidget, nProps)}*/}
      <MindDragScrollWidget {...nProps} />
      {controller.run('renderSheetCustomize', nProps)}
    </Container>
  );
}
