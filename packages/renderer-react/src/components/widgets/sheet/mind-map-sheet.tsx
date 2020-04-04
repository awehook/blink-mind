import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { RefKey } from '../../../utils';
import { BaseProps } from '../../common';
import { MindDragScrollWidget } from '../mind-drag-scroll-widget';

const log = require('debug')('node:mindmap-sheet');

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  flex-grow: 1;
  background: ${props => props.theme.background};
  position: relative;
`;
export function MindMapSheet_(props: BaseProps) {
  const { controller, saveRef, model } = props;
  log('model', model);
  const [diagramState, setDiagramState_] = useState(
    controller.run('getInitialSheetState', props)
  );
  const setDiagramState = arg => {
    setDiagramState_({ ...diagramState, ...arg });
  };
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

export const MindMapSheet = React.memo(
  MindMapSheet_,
  (prevProps, nextProps) => {
    const { controller } = prevProps;
    return controller.run('sheetAreEqual', { prevProps, nextProps });
  }
);
