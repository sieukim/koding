import styled from 'styled-components';

export const StyledAvatarForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

  width: 100%;
  height: 200px;
  margin-bottom: 24px;

  border: 1px solid #d9d9d9;
  border-radius: 2px;

  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    width: 150px;
    height: 150px;
    padding: 10px;

    border: 1px solid #d9d9d9;
    border-radius: 100px;

    * {
      margin-bottom: 5px;
    }

    .upload-text {
      margin-top: 5px;
      color: #000000d9;
      font-size: 15px;
    }

    .upload-hint {
      color: #00000073;
      font-size: 11px;
    }
  }

  .ant-avatar {
    width: 150px;
    height: 150px;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    width: 100px;

    div {
      width: 100%;
    }
  }
`;
