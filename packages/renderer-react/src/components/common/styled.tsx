import { Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.alignItems};
  justify-content: ${props => props.justifyContent};
`;

export const Margin = styled.div`
  margin: ${props => props.margin};
`;

export const ShowMenuIcon = styled.a`
  font-size: 20px !important;
`;

export const IconBg = styled.div`
  padding: 5px;
  cursor: pointer;
`;

export const Btn = styled.div`
  cursor: pointer;
  &:hover {
    color: #1ea7fd;
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0px !important;
`;

export const CloseIcon = styled(Btn)`
  position: absolute;
  right: 5px;
  top: 5px;
  //padding: 5px;
`;

export const Title = styled.div`
  height: 16px;
`;

export const TopicBlockIcon = styled.span`
  margin: 0px 10px;
  &:hover {
    color: palevioletred;
  }
`;

export const ZIndex = styled.div`
  z-index: ${props => props.zIndex};
`;

export const PanelTabRoot = styled.div`
  min-width: 360px;
  max-height: 470px;
  overflow: auto;
`;
