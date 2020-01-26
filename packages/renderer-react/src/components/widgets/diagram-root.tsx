import * as React from 'react';
import styled from 'styled-components';

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
  const { controller, docModel } = props;
  const model = docModel.currentCanvasModel;
  let canvas;
  if (docModel.canvasModels.size === 1) {
    canvas = controller.run('renderCanvas', {
      ...props,
      model: docModel.canvasModels.get(0)
    });
  }
  return (
    <Root>
      {controller.run('renderToolbar', { ...props, model })}
      <DiagramContainer>{canvas}</DiagramContainer>
    </Root>
  );
}
