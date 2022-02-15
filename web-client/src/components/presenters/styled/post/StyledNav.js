import styled from 'styled-components';

export const StyledNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 20px auto;
  width: 900px;
  height: 100px;

  .button {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 32px;
  }

  .prev-button,
  .next-button {
    width: 40%;
  }

  .prev-button {
    justify-content: left;

    .button-content {
      margin-left: 20px;
      text-align: left;

      .button-title {
        margin-bottom: 10px;
        font-size: 1rem;
      }

      .post-title {
        font-weight: 100;
      }
    }
  }

  .next-button {
    justify-content: right;

    .button-content {
      margin-right: 20px;
      text-align: right;
    }
  }

  .button-title {
    margin-bottom: 10px;
    font-size: 1rem;
  }

  .post-title {
    font-weight: 100;
  }

  .board-button {
    width: 20%;
    justify-content: center;
  }
`;
