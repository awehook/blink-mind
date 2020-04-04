import { Card, Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';
import { COLORS } from '../../utils';

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props =>
    props.flexDirection ? props.flexDirection : 'row'};
  align-items: ${props => props.alignItems};
  justify-content: ${props => props.justifyContent};
`;

export const InlineBlockSpan = styled.span`
  display: inline-block;
`;

export const Margin = styled.div`
  margin: ${props => props.margin};
`;

export const ShowMenuIcon = styled.div`
  font-size: 20px !important;
`;

export const IconBg = styled.div`
  padding: 5px;
  cursor: pointer;
`;

export const Btn = styled.div`
  cursor: pointer;
  &:hover {
    color: ${COLORS.LIGHT.ITEM_BG_ACTIVE};
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0px !important;
`;

export const CloseIcon = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
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
  .bp3-dark & {
    background-color: ${COLORS.DARK.ZINDEX_BG};
  }
`;

export const PanelTabRoot = styled.div`
  font-size: 12px;
  min-width: 380px;
  max-width: 482px;
  max-height: 480px;
  overflow: auto;
`;

export const ToolbarItemPopoverTarget = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const VListContainer = styled.div`
  max-height: ${props => props.maxHeight || '300px'};
  overflow-y: auto;
  overflow-x: hidden;
`;
