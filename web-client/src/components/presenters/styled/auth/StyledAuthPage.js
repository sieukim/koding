import styled from 'styled-components';

export const StyledAuthPage = styled.div`
  width: ${(props) => props.width};
  min-width: ${(props) => props.minWidth};
  max-width: ${(props) => props.maxWidth};

  margin: 50px 0;

  .button {
    margin-bottom: 24px;
  }

  .button-action {
    width: 100%;
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }
`;
