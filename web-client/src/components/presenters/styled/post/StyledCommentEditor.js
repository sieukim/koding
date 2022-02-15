import styled from 'styled-components';

export const StyledCommentEditor = styled.div`
  .editor-form {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .editor-meta {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;

      .writer-avatar {
        margin-bottom: 10px;
      }
    }

    .editor {
      width: 100%;
      margin-left: 20px;
    }
  }
`;
