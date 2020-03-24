import { COLORS } from '@blink-mind/renderer-react';
import { Popover } from '@blueprintjs/core';
import styled from 'styled-components';
export const TopicTitle = styled.div`
  margin: 0 5px;
  padding: 10px 5px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  white-space: pre-wrap;
  &:hover {
    background: ${COLORS.LIGHT.ITEM_BG_ACTIVE};
  }
  .bp3-dark & {
    &:hover {
      background: ${COLORS.DARK.ITEM_BG_ACTIVE};
    }
  }
`;

export const StyledPopover = styled(Popover)`
  display: block;
`;

export const Tip = styled.div`
  padding: 10px;
  font-size: 16px;
  //max-width: 800px;
  //max-height: 600px;
  overflow: auto;
`;

export const TipContent = styled.div`
  white-space: break-spaces;
`;
