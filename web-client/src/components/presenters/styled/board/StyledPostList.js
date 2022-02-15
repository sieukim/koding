import styled from 'styled-components';

export const StyledPostList = styled.div`
  .spinner {
    width: 100%;
    text-align: center;
  }

  a:hover {
    color: #1890ff !important;

    * {
      color: #1890ff !important;
    }
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
      color: black !important;
    }
  }

  .item-red {
    * {
      color: #cf1322 !important;
    }
  }

  .item-yellow {
    * {
      color: #faad14 !important;
    }
  }

  .item-blue {
    * {
      color: #096dd9 !important;
    }
  }

  .ant-list-item-main {
    padding: 20px;
  }

  .ant-list-item-extra {
    display: flex;
    align-items: center;

    a:hover {
      * {
        color: #f5f5f5 !important;
      }
    }
  }
`;
