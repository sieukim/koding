import styled from 'styled-components';

export const StyledPost = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px auto 0 auto;
  padding: 32px;
  width: 900px;

  .spinner {
    width: 100%;
    text-align: center;
  }

  .post-title {
    font-size: 2em;
  }

  a:hover {
    color: #1890ff !important;

    * {
      color: #1890ff !important;
    }
  }

  .toastui-editor-contents {
    margin: 27px 0;
    padding: 10px;
  }

  .item-nickname {
    a {
      color: black !important;
    }

    a:hover {
      color: #1890ff !important;
    }
  }

  .item-black {
    * {
      color: black;
    }
  }

  .item-red {
    * {
      color: #cf1322;
    }
  }

  .item-blue {
    * {
      color: #096dd9;
    }
  }

  .item-yellow {
    * {
      color: #faad14;
    }
  }

  .tag-container {
    padding: 10px;
  }

  .tag:hover {
    cursor: pointer;
  }
`;
