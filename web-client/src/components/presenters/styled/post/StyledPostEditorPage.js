import styled from 'styled-components';

export const StyledPostEditorPage = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px 0;
  padding: 32px 32px 8px 32px;
  width: 900px;

  .title-container {
    border: none;
    border-left: 1px solid rgb(217, 217, 217);
  }

  .tags-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
`;
