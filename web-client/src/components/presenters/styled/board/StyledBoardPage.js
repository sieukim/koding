import styled from 'styled-components';

export const StyledBoardPage = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px 0;
  padding: 32px;
  width: 900px;

  .board-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 20px 0;

    .button {
      margin-left: 20px;
    }
  }

  .post-list {
    min-height: 50vh;
  }
`;
