import styled from 'styled-components';

export const StyledBody = styled.div`
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'row'};
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;
