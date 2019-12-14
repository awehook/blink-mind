import styled from 'styled-components';
export const ToolBar = styled.div`
  width: calc(100% - 18px);
  height: 36px;
  background: white;
  display: flex;
`;

export const ToolBarItem = styled.div`
  padding: 5px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: inline-block;
`;

export const Icon = styled.div`
  width: 26px;
  height: 26px;
  font-size: 26px !important;
  &:hover {
    color: #106ba3;
  }
`;
