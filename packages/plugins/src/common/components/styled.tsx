import { Popover } from '@blueprintjs/core';
import styled from 'styled-components';

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
