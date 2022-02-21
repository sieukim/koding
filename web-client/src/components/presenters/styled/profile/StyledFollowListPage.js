import styled from 'styled-components';

export const StyledFollowListPage = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 4px 11px;
  margin: 50px auto;
  width: 900px;
  min-height: 80vh;

  .follow-container {
    padding: 10px;

    a {
      font-size: 15px;
      color: black;

      :hover {
        color: #1890ff;
      }
    }

    .follow-user-avatar {
      margin-right: 10px;
    }
  }
`;
