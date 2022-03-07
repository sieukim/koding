import styled from 'styled-components';

export const StyledProfilePage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 82px auto 0 auto;
  width: 900px;

  .spinner {
    width: 100%;
    text-align: center;
  }

  .item-container {
    display: flex;
    flex-direction: column;
    width: 435px;
    min-height: 510px;
  }

  .item-container-default {
    align-items: center;
    justify-content: center;
    padding: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 10px;

    .item {
      margin-bottom: 20px;
    }

    .follow-item {
      display: flex;
      justify-content: space-evenly;
      border-bottom: 1px solid #d9d9d9;
      padding-bottom: 10px;
      width: 70%;

      & > div {
        font-size: 1rem;
      }
    }

    .user-info-item {
      display: flex;
      flex-direction: column;
      width: 70%;

      & > div:first-child {
        margin-bottom: 10px;
      }
    }

    .collection-button {
      margin-left: 10px;
    }
  }

  .item-container-editable {
    a {
      color: black;

      :hover {
        color: #1890ff;
      }
    }

    .url-item-blog,
    .url-item-github,
    .url-item-portfolio,
    .techStack-item-techStack,
    .techStack-item-interestTech {
      border: 1px solid #d9d9d9;
      border-radius: 10px;
      padding: 15px 20px;
      margin-bottom: 10px;
    }

    .techStack-item-interestTech {
      margin-bottom: 0;
    }

    .techStack-item-techStack,
    .techStack-item-interestTech {
      min-height: 100px;
    }

    .url-item-header,
    .techStack-item-header {
      font-weight: 600;
    }

    .url-item-contents {
      margin-left: 5px;
    }

    .techStack-tag,
    .interestTech-tag {
      margin: 5px;
    }
  }
`;
