import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.alignItems};
`;

export const Margin = styled.div`
  margin: ${props => props.margin};
`;
