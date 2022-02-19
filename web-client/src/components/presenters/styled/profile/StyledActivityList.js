import styled from 'styled-components';

export const StyledActivityList = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 4px 10px 20px 10px;
  margin: 50px auto;
  width: 900px;

  .item-red {
    padding-right: 8px;

    * {
      color: #cf1322;
    }
  }

  .item-black {
    padding-left: 8px;

    * {
      color: black;
    }
  }

  .comment-activity-container {
    .comment-activity {
      padding: 20px;

      .comment-activity-title {
        display: flex;
        margin: 0;
      }
    }
  }
`;
