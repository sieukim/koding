import styled from 'styled-components';

export const StyledNotificationPage = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px 0;
  padding: 32px;
  width: 900px;

  .button-container {
    width: 100%;
    text-align: right;
  }

  .button {
    width: 32px;
    height: 32px;
    color: grey;

    & > span {
      width: 12px;
      height: 12px;
      margin: 0 auto;
    }

    :hover {
      color: #1890ff !important;
    }
  }

  .button-readAll,
  .button-removeAll {
    margin: 0 8px;
  }

  .read-true {
    * {
      color: grey !important;
    }
  }

  .notification {
    display: flex;
    align-items: center;

    .notification-avatar {
      background: white;
      color: #1890ff;
      font-size: 24px;
    }

    .notification-warning {
      color: #fadb14;
    }

    .ant-list-item-meta-content {
      margin: auto 0;

      .notification-title,
      .notification-description {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 0;

        a {
          color: #1890ff;
        }

        p {
          margin: 0 5px;
        }
      }
    }
  }

  .footer-text {
    text-align: center;
    color: #1890ff;
    margin-top: 24px;
  }
`;
