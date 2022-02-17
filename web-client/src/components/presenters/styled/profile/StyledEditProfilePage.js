import styled from 'styled-components';

export const StyledEditProfilePage = styled.div`
  width: 450px;

  .default-value-container {
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    padding: 4px 11px;
    margin-bottom: 24px;
    font-size: 14px;

    .default-value-icon {
      margin-right: 4px;
    }
  }

  .variable-value-container {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .variable-value-url {
      width: 80%;
    }

    .variable-value-checkbox {
      width: 15%;
    }
  }

  .button {
    width: 100%;
    margin-bottom: 24px;
  }
`;
