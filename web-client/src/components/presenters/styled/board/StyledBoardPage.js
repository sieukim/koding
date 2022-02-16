import styled from 'styled-components';

export const StyledBoardPage = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px 0;
  padding: 32px;
  width: 900px;

  .board-action {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 20px 0;

    .button-write {
      margin-left: 20px;
    }
  }

  .board-sort {
    display: flex;
    flex-direction: row;
    justify-content: right;
    margin: 10px 0;

    .button-sort {
      color: grey;
    }

    .button-selected {
      color: #1890ff;
    }
  }

  .post-list {
    min-height: 50vh;
  }
`;
